import {
  MainAST,
  ContentAST,
  ContentTextAST,
  ExecutionStrand,
  ExecutionResult,
  StateElement,
  ChoiceAST,
  LabelAST,
  ContentSubstitutionAST,
  FunctionInvocationAST,
  ContentAssignmentAST,
  NodeExecutionResult,
  ExecutionResultItem,
  ContentChoiceAST,
  ExternalAST,
  InputAST,
  ReturnCommand,
  ValueAST,
  ContentItemAST,
} from "./types";
import { RNG } from "./rng";
import { ExecutionContext } from "./ExecutionContext";
import { stringifyResult, coalesceResult } from "./parse";
import { FunctionAST } from "./types";

// TODO: command line param
const debug = (...parts: any) => {};
// const debug = (...parts: any) => console.log(...parts);

type ExecutionOptions = {
  rng?: RNG;
  initialState?: Record<string, StateElement>;
  entryPoint?: string;
};

const executeTextNode = (node: ContentTextAST) => {
  return [node.text];
};

const inheritStrand = (parent: ExecutionStrand): ExecutionStrand => ({
  ...parent,
  internalState: undefined,
  children: [],
  path: "",
});

let executeNode: (
  node: ContentAST | null,
  context: ExecutionContext,
  strand: ExecutionStrand
) => NodeExecutionResult;

const executeArrayNode = (
  node: ContentItemAST[],
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  const results: ExecutionResultItem[] = [];
  let i = 0;
  if (strand.children.length) {
    // Has already executed
    i = strand.children[0].path as number;
  }
  while (i < node.length) {
    const choice = node[i];
    if (!strand.children[0] || strand.children[0].path !== i) {
      strand.children = [{ ...inheritStrand(strand), path: i }];
    }

    const result = executeNode(choice, context, strand.children[0]);
    results.push(...result);
    if (context.suspend) {
      break;
    }
    i++;
  }
  return results;
};

const valueOfExpression = (
  value: ValueAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): string | number => {
  if (["string", "number"].includes(typeof value)) {
    return (value as unknown) as string;
  }
  switch (value.type) {
    case "text":
    case "number":
    case "percent":
      return value.value as number;
    case "compound":
      const results = executeNode(value.value as ContentAST, context, strand);
      if (context.suspend) {
        throw new Error(
          "Attmempted to suspend during processing of precondition expressions."
        );
      }
      // TODO: How to handle executions that might return a number ...
      return stringifyResult(results);
    default:
      throw new Error("Unknown value type: " + JSON.stringify(value));
  }
};

/**
 * Match is defined as "approximately equals".
 * For
 */
const matchValue = (left: string | number, right: string | number) => {
  // Javascript cast equals
  if (left == right) {
    return true;
  }
  if (typeof left === "string") {
    return left.indexOf(right.toString()) > -1;
  }
  if (typeof left === "number") {
    // TODO: Should attempt to convert right string to number
    if (typeof right !== "number") {
      return false;
    }
    // TODO: This is temporary: intended for use in lists where range is midpoint between prev and next values
    // Are they within 10%?
    return left * 0.9 < right && left * 1.1 > right;
  }
  return false;
};

const matchPreconditions = (
  choice: ChoiceAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  if (choice.preconditions.length === 0) {
    return true;
  }
  // TODO: Gets a bit more complicated if suspensions are allowed inside expression values
  // TODO: Way more things to consider like AND/OR, math, all sorts
  for (const pre of choice.preconditions) {
    let leftValue: string | number;
    if (!pre.left) {
      // Is there an available default parameter?
      // TODO: Naughty in a couple of ways. Object.values does not have a definite ordering.
      // Also localScope could get polluted with other local vars if local vars are implemented.
      leftValue = Object.values(strand.localScope)[0] as string;
    } else {
      leftValue = valueOfExpression(pre.left, context, strand);
    }
    const rightValue = valueOfExpression(pre.right, context, strand);
    let passed = false;
    switch (pre.operator) {
      case "eq":
        // TODO: Consider difference of === or ==. = and == ?
        // TODO: Cheap hack for now using == to get around string/number difference
        passed = leftValue == rightValue;
        break;
      case "noteq":
        passed = leftValue != rightValue;
        break;
      case "gt":
        passed = leftValue > rightValue;
        break;
      case "gteq":
        passed = leftValue >= rightValue;
        break;
      case "lt":
        passed = leftValue < rightValue;
        break;
      case "lteq":
        passed = leftValue <= rightValue;
        break;
      case "match":
        passed = matchValue(leftValue, rightValue);
        break;
      case "notmatch":
        passed = !matchValue(leftValue, rightValue);
        break;
    }
    if (!passed) {
      // First level preconditions are AND for now, return immediately on first pass
      return false;
    }
  }
  return true;
};

const executeChoicesNode = (
  node: ContentChoiceAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  const choices = node.content;
  let chosen;
  if (strand.children[0]) {
    chosen = choices[strand.children[0].path as number];
  } else {
    // Check all preconditions first to find a filtered list
    const filtered = choices.filter((choice) =>
      matchPreconditions(choice, context, strand)
    );
    if (filtered.length === 1) {
      chosen = filtered[0];
    } else if (filtered.length > 1) {
      // TODO: preconditions could optionally modify weight, leave that for another day
      chosen = context.rng.pick<ChoiceAST>(filtered, "weight");
    }
    if (chosen) {
      strand.children = [
        {
          ...inheritStrand(strand),
          path: choices.indexOf(chosen), // TODO: indexOf doesn't scale so great
        },
      ];
    }
  }
  return chosen ? executeNode(chosen.content, context, strand.children[0]) : [];
};

const executeChoicesNodeAll = (
  node: ContentChoiceAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  const choices = node.content;
  const results: ExecutionResultItem[] = [];
  let i = 0;
  if (strand.children.length) {
    // Has already executed
    i = strand.children[0].path as number;
  }
  while (i < choices.length) {
    const choice = choices[i];
    if (!strand.children[0] || strand.children[0].path !== i) {
      strand.children = [{ ...inheritStrand(strand), path: i }];
    }
    // TODO: We might even need to suspend during precondition matching. Or could
    // just throw an error? Gets super messy otherwise...
    if (!matchPreconditions(choice, context, strand.children[0])) {
      i++;
      continue;
    }
    const result = executeNode(choice.content, context, strand.children[0]);
    results.push(...result);
    if (context.suspend) {
      break;
    }
  }
  return results;
};

// TODO: Generally not happy with this whole system, needs serious revision
const resolveLabelPath = (
  path: string | ContentAST,
  context: ExecutionContext,
  strand: ExecutionStrand,
  resolveParent: any,
  resolveLabels?: Record<string, LabelAST>,
  parameters?: ContentAST[]
  // TODO: returning the label name and `foudn`
): [string, any, NodeExecutionResult] => {
  let found;

  // TODO: There's a bug in using childStrand for path ... or maybe in using strand for
  // internalState ... not sure but both should be the same, seems weird
  let childStrand = strand.children[0] || {
    ...inheritStrand(strand),
    path: "label",
  };
  strand.children[0] = childStrand;

  if (childStrand.path === "label") {
    if (typeof path === "object") {
      const labelResult = executeNode(path as ContentAST, context, childStrand);
      // NOTE: Doesn't seem like it makes sense to resolve mid-path; maybe it hurts performance
      // and we can optimise by just removing some unneccessary processing of suspense here
      // (and throw an error)
      if (context.suspend) {
        strand.internalState =
          (strand.internalState || "") +
          stringifyResult(labelResult.slice(0, labelResult.length - 1));
        return [
          strand.internalState,
          resolveParent,
          [labelResult[labelResult.length - 1]],
        ];
      } else {
        strand.internalState =
          (strand.internalState || "") + stringifyResult(labelResult);
      }
    }
  }

  // Don't try to run labels again next time if something else suspends now...
  if (childStrand.path === "label") {
    childStrand.path = "labelDone";
  }

  const labelName = strand.internalState
    ? (strand.internalState as string)
    : (path as string);

  debug("Path", labelName);

  // More weird logic, if we're trying to resolve a label it means local scope is also still in play.
  // TODO: Make a proper inheriting object (in some optimal way) and have it on the StrandContext so
  // all strands running in the context have a single object to check for scope purposes
  // TODO: Also makes it easier when calling externals etc
  if (
    resolveLabels &&
    Object.prototype.hasOwnProperty.call(strand.localScope, labelName)
  ) {
    found = strand.localScope[labelName];
  } else if (Object.prototype.hasOwnProperty.call(resolveParent, labelName)) {
    found = resolveParent[labelName];
  } else if (resolveLabels) {
    found = resolveLabels[labelName];
    if (found === undefined) {
      // TODO: Sometimes, undefined might be desired
      return [labelName, found, [`<Error: Label ${labelName} not found>`]];
    }
  }

  if (found === null || typeof found === "undefined") {
    return [labelName, found, []];
  }
  // TODO: Some reliable test for "is this something executable like a label or another story?"
  // ...Answer is have a better managed `scope` which knows what type each thing is...
  // ...isArray is very broken here as we might just want to have an array...
  if ((typeof found === "object" && found.type) || Array.isArray(found)) {
    // Logic getting insanely convoluted until this mess is sorted out ...
    // Here we have to drop the localScope *only* if we're about to resolve a label
    // with no function parameters (and it's not an external).
    // executionFunctionNodeInvocation will handle the
    // function scope (it still needs local scope to evaluate params).
    // This really all should be a lot cleamer.
    if (childStrand.path !== "content") {
      childStrand = strand.children[0] = {
        ...inheritStrand(strand),
        path: "content",
        localScope: parameters || found.external ? strand.localScope : {},
      };
    }
    found = parameters
      ? executeFunctionNodeInvocation(found, parameters, context, childStrand)
      : executeNode(found, context, childStrand);
    return [labelName, found, found];
  } else {
    return [labelName, found, [found as string]];
  }
};

const executeFunctionNodeInvocation = (
  node: FunctionAST,
  parameters: ContentAST[],
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  debug("Invoking function", node.name, parameters);

  if (node.type !== "label") {
    throw new Error(
      "Function invocation must be performed on label, found: " +
        JSON.stringify(node, null, "  ")
    );
  }

  if (!node.signature || node.signature.length === 0) {
    throw new Error(
      "Label " +
        node.name +
        " has no parameters so cannot be called as a function"
    );
  }

  // TODO: Still need to implement actual default values
  for (const i in node.signature) {
    if (!node.signature[i].optional && typeof parameters[i] === "undefined") {
      throw new Error(
        "Label " + node.name + " requires parameter $" + node.signature[i].name
      );
    }
  }

  // Evaluate parameters
  const parameterValues: NodeExecutionResult[] = strand.internalState || [];
  let i = 0;
  let invoke = false;
  if (strand.children.length) {
    // Has already executed
    if (strand.children[0].path === "invoke") {
      invoke = true;
    } else {
      i = strand.children[0].path as number;
    }
  }
  if (!invoke) {
    while (i < parameters.length) {
      const paramNode = parameters[i];
      parameterValues[i] = parameterValues[i] || [];
      if (!strand.children[0] || strand.children[0].path !== i) {
        strand.children = [{ ...inheritStrand(strand), path: i }];
      }

      const result = executeNode(paramNode, context, strand.children[0]);
      parameterValues[i].push(...result);
      if (context.suspend) {
        break;
      }
      i++;
    }
  }

  if (context.suspend) {
    return [parameterValues[i][parameterValues[i].length - 1]];
  }

  // TODO: Also changes with named params
  // TODO: Buffer in internal state?
  const localScope = node.signature.reduce((acc, param, i) => {
    if (typeof parameterValues[i] !== "undefined") {
      acc[param.name] = coalesceResult(parameterValues[i]);
    }
    debug("Parameter", param.name, acc[param.name]);
    return acc;
  }, {} as Record<string, any>);

  if (!invoke) {
    strand.children[0] = {
      ...inheritStrand(strand),
      path: "invoke",
      localScope,
    };
  }

  return executeNode(node, context, strand.children[0]);
};

const executeSubstitutionNode = (
  node: ContentSubstitutionAST | FunctionInvocationAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  debug("Substituting", node.path);
  let i = 0;
  let resolveParent: any =
    typeof strand.internalState === "undefined"
      ? context.state
      : strand.internalState;
  let result: ExecutionResultItem[] = [];
  if (strand.children.length) {
    // Has already executed
    i = strand.children[0].path as number;
  }
  while (i < node.path.length) {
    const path = node.path[i];

    if (!strand.children[0] || strand.children[0].path !== i) {
      strand.children = [{ ...inheritStrand(strand), path: i }];
    }

    const [labelName, nextParent, results] = resolveLabelPath(
      path,
      context,
      strand.children[0],
      resolveParent,
      i === 0 ? context.main.labels : undefined,
      i === node.path.length - 1 && node.type === "invoke"
        ? (node as FunctionInvocationAST).parameters
        : undefined
    );
    result = results;
    if (context.suspend) {
      break;
    }
    resolveParent = strand.internalState = nextParent;
    if (i < node.path.length - 1 && typeof resolveParent !== "object") {
      throw new Error(`Label path ${labelName} not found`);
    }
    i++;
  }
  if (!context.suspend) {
    result = [resolveParent];
  }
  debug("Substitution", node.path, result);
  return result;
};

const executeAssignmentNode = (
  node: ContentAssignmentAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  const childStrand = strand.children[0] || {
    ...inheritStrand(strand),
    path: "content",
  };
  strand.children[0] = childStrand;
  const result = executeNode(node.content, context, childStrand);
  // TODO: Variable could also be content that needs resolving
  if (context.suspend) {
    const command = result[result.length - 1];
    strand.internalState =
      (strand.internalState || "") +
      stringifyResult(result.slice(0, result.length - 1));
    return [command];
  } else {
    // TODO: We won't always want to stringify the result. Could assign a number, an entity,
    // a label ref, etc etc. Just automatically stringify if there are any text components,
    // maybe have an &= operator for storing references specifically.
    context.state[node.variable] =
      (strand.internalState || "") + stringifyResult(result);
    // Return nothing after completed assignment
    return [];
  }
};

const executeExternalNode = (
  node: ExternalAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  debug("Executing external");
  const childStrand = strand.children[0] || {
    ...inheritStrand(strand),
    // NOT persisted to any subsequent children (unlikely to use it tho), although it
    // is used in calling the external. ???
    localScope: {},
  };
  strand.children = [childStrand];
  // TODO: Properly convert primitives in ScopeValue objects
  const externalScope = { ...context.state, ...strand.localScope };
  const result = node.callback(externalScope, context, childStrand);
  // Be forgiving with external function results
  return Array.isArray(result) ? result : [result];
};

const executeInputNode = (
  node: InputAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  const inputStrand = strand.children[0] || inheritStrand(strand);
  strand.children[0] = inputStrand;
  // TODO: Using internalState works, but should use yieldValue prop instead?
  if (typeof inputStrand.internalState !== "undefined") {
    // Might not be a string; could be entity, object etc
    debug("Received input", inputStrand.internalState);
    return [inputStrand.internalState as string];
  }
  // TODO: strand context should be suspended instead
  context.suspend = true;
  return [
    {
      type: "input",
      handler: node.handler,
      strand: inputStrand,
    } as ReturnCommand,
  ];
};

executeNode = (
  node: ContentAST | null,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  if (node === null || typeof node === "undefined") {
    return [];
  }

  if (typeof node === "string") {
    return [node];
  } else if (Array.isArray(node)) {
    return executeArrayNode(node, context, strand);
  } else if (typeof node.type === "undefined") {
    throw new Error(
      "Undefined content type: \n" + JSON.stringify(node, null, "  ")
    );
  } else {
    switch (node.type) {
      case "text":
        return executeTextNode(node as ContentTextAST);
      case "choices":
        return executeChoicesNode(node as ContentChoiceAST, context, strand);
      case "main": {
        const result = executeNode((node as MainAST).content, context, strand);
        if (!context.suspend) {
          context.finished = true;
        }
        return result;
      }
      case "label": {
        // TODO: This is actually ExecuteLabelNode
        // TODO: Create a new thread context with scope when pathing into label.
        const label = node as LabelAST;
        if ((label.content as ContentItemAST).type === "choices") {
          if (
            // Execute all choices
            // TODO: In parallel with bails
            label.mode === "all"
          ) {
            // TODO: Combine executions in context
            return executeChoicesNodeAll(
              label.content as ContentChoiceAST,
              context,
              strand
            );
          } else {
            const results = executeChoicesNode(
              label.content as ContentChoiceAST,
              context,
              strand
            );

            // Kind of duplication with executeAssignmentNode
            if (label.mode === "set") {
              if (!context.suspend) {
                context.state[label.name] =
                  (strand.internalState || "") + stringifyResult(results);
              } else {
                strand.internalState =
                  (strand.internalState || "") + stringifyResult(results);
              }
            }
            return results;
          }
        } else {
          return executeNode(label.content, context, strand);
        }
      }
      case "substitution":
      case "invoke":
        return executeSubstitutionNode(
          node as ContentSubstitutionAST,
          context,
          strand
        );
      case "assignment":
        return executeAssignmentNode(
          node as ContentAssignmentAST,
          context,
          strand
        );
      case "external":
        return executeExternalNode(node as ExternalAST, context, strand);
      // case "function":
      // TODO: Create a new localScope (therefore a new StrandContext)
      //   const functionNode = content as FunctionAST;
      //   switch (functionNode.name) {
      //     case "OUT":
      //       break;
      //   }
      //   currentContext.error = true;
      //   return [
      //     "Could not resolve function <" + functionNode.name + ">",
      //     currentContext,
      //   ];
      case "input":
        return executeInputNode(node as InputAST, context, strand);
      default:
        throw new Error(
          "Unknown node type in node: " + JSON.stringify(node, null, "  ")
        );
    }
  }
};

export const executeText = (
  main: MainAST,
  options: ExecutionOptions,
  previousContext?: ExecutionContext
): ExecutionResult => {
  // TODO: rng moves onto context?
  const { rng, entryPoint, initialState } = options;

  if (previousContext && previousContext.main !== main) {
    throw new Error("previousContext must have same main as next call");
  }

  const rootStrand: ExecutionStrand =
    previousContext && previousContext.root
      ? previousContext.root
      : {
          path: entryPoint || "",
          localScope: {},
          children: [],
        };

  let context: ExecutionContext =
    previousContext ||
    new ExecutionContext({ state: initialState, rng, root: rootStrand, main });

  context.suspend = false;

  let entryNode: ContentItemAST | undefined = main;
  if (entryPoint) {
    entryNode = main.labels[entryPoint];
    if (!entryNode) {
      throw new Error("Entrypoint label not found: " + entryPoint);
    }
  }

  const results = executeNode(entryNode, context, rootStrand);
  return [results, context];
};

export const render = (
  main: MainAST,
  rng: RNG,
  variables?: Record<string, string>,
  entryPoint: string = ""
): string => {
  // console.log(JSON.stringify(main, null, "  "));
  const stream = executeText(main, {
    rng,
    entryPoint,
    initialState: variables,
  });

  return stringifyResult(stream[0]);
};

export const stream = (
  main: MainAST,
  rng: RNG,
  variables?: Record<string, string>,
  executionContext?: ExecutionContext,
  entryPoint: string = ""
) =>
  executeText(
    main,
    {
      rng,
      initialState: variables,
      entryPoint,
    },
    executionContext
  );

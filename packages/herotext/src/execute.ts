import {
  MainAST,
  ContentAST,
  ContentTextAST,
  ExecutionStrand,
  ExecutionResult,
  StateElement,
} from "./types";
import { RNG } from "./rng";
import { ExecutionContext } from "./ExecutionContext";
import { ContentItemAST } from "../dist/src/types";
import {
  ChoiceAST,
  LabelAST,
  ContentSubstitutionAST,
  ContentAssignmentAST,
} from "./types";
import { stringifyResult } from "./parse";
import { ExternalAST, InputAST, ReturnCommand } from "./types";
import {
  NodeExecutionResult,
  ExecutionResultItem,
  ContentChoiceAST,
} from "./types";

type ExecutionOptions = {
  rng?: RNG;
  initialState?: Record<string, StateElement>;
  entryPoint?: string;
};

const executeTextNode = (node: ContentTextAST) => {
  return [node.text];
};

const baseStrand = () => ({ localScope: {}, children: [] });

let executeNode: (
  node: ContentAST,
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
    if (strand.children[0].path !== i) {
      strand.children = [
        { ...baseStrand(), path: i, localScope: {}, children: [] },
      ];
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
    chosen = context.rng.pick<ChoiceAST>(choices, (choice) =>
      // TODO: Logic might need to be a bit more intricate than this; some weird
      // cases might be afoot. Failing precondition maybe means item should be excluded from list
      // altogether.
      matchPreconditions(choice, context) ? choice.weight : 0
    );
    strand.children = [
      {
        ...baseStrand(),
        path: choices.indexOf(chosen), // OPTI: indexOf doesn't scale
      },
    ];
  }
  return executeNode(chosen.content, context, strand.children[0]);
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
    if (strand.children[0].path !== i) {
      strand.children = [
        { ...baseStrand(), path: i, localScope: {}, children: [] },
      ];
    }
    // TODO: We might even need to suspend during precondition matching. Or could
    // just throw an error? Gets super messy otherwise...
    if (!matchPreconditions(choice, context)) {
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

const executeSubstitutionNode = (
  node: ContentSubstitutionAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  let found;
  let labelName: string = node.label as string;

  const childStrand = strand.children[0] || {
    ...baseStrand(),
    path: "label",
  };
  if (childStrand.path === "label") {
    if (typeof labelName === "object") {
      const labelResult = executeNode(
        node.label as ContentAST,
        context,
        childStrand
      );
      if (context.suspend) {
        strand.internalState =
          (strand.internalState || "") +
          stringifyResult(labelResult.slice(0, labelResult.length - 1));
        return [labelResult[labelResult.length - 1]];
      } else {
        strand.internalState =
          (strand.internalState || "") + stringifyResult(labelResult);
      }
    }
  }

  labelName = strand.internalState
    ? (strand.internalState as string)
    : labelName;

  childStrand.path = "content";
  if (Object.prototype.hasOwnProperty.call(context.state, labelName)) {
    found = context.state[labelName];
  } else {
    // TODO: Index them
    found = context.main.labels.find((l) => l.name === labelName);
  }
  if (found === undefined) {
    return [`<Error: Label ${labelName} not found>`];
  }
  return typeof found === "string"
    ? [found as string]
    : executeNode(found, context, childStrand);
};

const executeAssignmentNode = (
  node: ContentAssignmentAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  const childStrand = strand.children[0] || {
    ...baseStrand(),
    path: "content",
  };
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
  const childStrand = strand.children[0] || {
    ...baseStrand(),
  };
  strand.children = [childStrand];
  const result = node.callback(context.state, context, childStrand);
  // Be forgiving with external function results
  return Array.isArray(result) ? result : [result];
};

const executeInputNode = (
  node: InputAST,
  context: ExecutionContext,
  strand: ExecutionStrand
) => {
  const inputStrand = strand.children[0] || { ...baseStrand() };
  // TODO: Using internalState works, but should use yieldValue prop instead?
  if (typeof inputStrand.internalState !== "undefined") {
    // Might not be a string; could be entity, object etc
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
  node: ContentAST,
  context: ExecutionContext,
  strand: ExecutionStrand
): NodeExecutionResult => {
  if (node === null || typeof node === "undefined") {
    // TODO: Most likely indicates a parse error. Throw something?
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
        const result = executeChoicesNode(
          node as ContentChoiceAST,
          context,
          strand
        );
        if (!context.suspend) {
          context.finished = true;
        }
        return result;
      }
      case "label": {
        // TODO: This is actually ExecuteLabelNode
        // TODO: Create a new thread context when pathing into label.
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
  let entryNode: ContentItemAST | undefined = main;
  if (entryPoint) {
    entryNode = main.labels.find((label) => label.name === entryPoint);
    if (!entryNode) {
      throw new Error("Entrypoint label not found: " + entryPoint);
    }
  }

  const results = executeNode(entryNode, context, rootStrand);
  return [results, context];
};

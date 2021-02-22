import * as nearley from "nearley";
import { RNG } from "./rng";
import { ExecutionContext, ExecutionContextPath } from "./ExecutionContext";
import isFunction from "lodash/isFunction";

const grammar = require("./herotext.js");

export type ReturnCommand = {
  type: "input";
  yieldValue?: any;
  execution: ExecutionContextPath;
};

export type ExecutionResultItem = string | ReturnCommand;
export type ExecutionResult = ExecutionResultItem[];

interface ContentItemAST {
  type:
    | "text"
    | "substitution"
    | "main"
    | "label"
    | "assignment"
    | "function"
    | "choices"
    | "input"
    | "external";
}

type ContentAST = ContentItemAST[] | ContentItemAST;

type ContentTextAST = ContentItemAST & {
  type: "text";
  text: string;
};

type ContentSubstitutionAST = ContentItemAST & {
  type: "substitution";
  label: string | ContentAST;
};

type ContentAssignmentAST = ContentItemAST & {
  type: "assignment";
  variable: string;
  content: ContentAST;
};

type FunctionInvocationAST = Omit<ContentSubstitutionAST, "type"> & {
  parameters: Record<string, ContentItemAST>;
};

type ValueAST = {
  type: "number" | "percent" | "compound";
  value: number | ContentAST;
};

type PreconditionAST = {
  left: ValueAST;
  right: ValueAST;
  operator: "eq" | "gteq" | "lteq" | "match" | "noteq" | "notmatch";
};

type ChoiceAST = {
  type: "choice";
  weight: number;
  content: ContentAST;
  preconditions: PreconditionAST[];
};

type ContentChoiceAST = {
  type: "choices";
  content: ChoiceAST[];
};

type FunctionASTParameter = {
  name: string;
  defaultValue: ContentItemAST;
};

type FunctionAST = Omit<LabelAST, "type"> & {
  type: "function";
  parameters: FunctionASTParameter[];
};

type ExternalAST = ContentItemAST & {
  type: "external";
  callback: (state: Record<string, string>) => ExecutionResult;
};

type MainAST = {
  type: "main";
  content: ContentAST;
  labels: LabelAST[];
};

type LabelAST = Omit<ContentItemAST, "type"> & {
  type: "label";
  name: string;
  external: boolean;
  mode: "label" | "set" | "all";
  merge: boolean;
  content: ContentAST;
};

type ImportLabels = Record<string, string | ContentAST>;

const ERROR_MAIN: MainAST = {
  type: "main",
  content: [],
  labels: [],
};

const createChoicesFromObject = (
  value: ContentAST | ChoiceAST[]
): ContentAST => {
  if (!Array.isArray(value)) return value;
  return {
    type: "choices",
    content: value,
  } as ContentChoiceAST;
};

const createLabelsFromObject = (labels: ImportLabels) =>
  Object.entries(labels).map<LabelAST>(([key, value]) => {
    let content: ContentAST;
    if (value === null || typeof value === "undefined") {
      content = { type: "text", text: "" } as ContentTextAST;
    } else if (typeof value === "string") {
      content = { type: "text", text: value } as ContentTextAST;
    } else if (typeof value === "number" || typeof value === "boolean") {
      content = {
        type: "text",
        text: (value as number).toString(),
      } as ContentTextAST;
    } else if (Array.isArray(value)) {
      // TODO: Might make more sense to just render all sequentially?
      content = createChoicesFromObject(value);
    } else if (isFunction(value)) {
      content = {
        type: "external",
        callback: value,
      } as ExternalAST;
    } else {
      content = {
        type: "text",
        text: `Cannot handle external type (${typeof value}): ${value.toString()}`,
      } as ContentTextAST;
    }
    return {
      type: "label",
      mode: "label",
      name: key,
      external: true,
      merge: false,
      content,
    };
  });

export const parse = (
  input: string,
  mergedTemplates?: ParsedTextTemplate[]
): MainAST => {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar as nearley.CompiledRules)
  );
  let parsed;
  try {
    parsed = parser.feed(input.trim() + "\n");
  } catch (error) {
    console.error("Unparseable text:");
    console.error(input);
    console.error(error);
    throw new Error("Unparseable text");
  }
  const main = (parsed.results[0] as unknown) as MainAST;
  if (main.labels.some((label) => label.name.startsWith("OUT"))) {
    console.error("Labels beginning with OUT are reserved for external calls:");
    console.error(input);
    console.error(parsed);
    throw new Error(
      "Labels beginning with OUT are reserved for external calls"
    );
  }
  if (mergedTemplates) {
    // TODO: Potentially hierarchical labels could be a thing
    const mergedLabels: Record<string, LabelAST> = {};
    for (const template of mergedTemplates) {
      for (const label of template.main.labels) {
        mergedLabels[label.name] = label;
      }
    }
    for (const label of Object.values(mergedLabels)) {
      if (!main.labels.some((l) => l.name === label.name)) {
        main.labels.push(label);
      }
    }
  }
  return main;
};

const stringifyResultItem = (element: string | ReturnCommand): string => {
  if (typeof element === "string") {
    return element;
  }
  return "?";
};

const stringifyResult = (elements: ExecutionResult): string => {
  return elements.map(stringifyResultItem).join("");
};

const matchPreconditions = (
  choice: ChoiceAST,
  context: ExecutionContext
  // TODO: Default positional parameters (from func signature)
): boolean => {
  for (const pre of choice.preconditions) {
    // TODO: Actually check them
  }
  return true;
};

export const executeText = (
  main: MainAST,
  rng: RNG,
  variables?: Record<string, string>,
  executionContext?: ExecutionContext,
  entryPoint: string = ""
): [ExecutionResult, ExecutionContext] => {
  let currentContext: ExecutionContext = executionContext
    ? executionContext.clone()
    : new ExecutionContext(variables);
  const processContent = (
    content: ContentAST
  ): [ExecutionResult, ExecutionContext] => {
    if (content === null || typeof content === "undefined") {
      // TODO: Most likely indicates a parse error. Throw something?
      return [[], currentContext];
    }
    if (typeof content === "string") {
      return [[content], currentContext];
    }
    if (Array.isArray(content)) {
      const results: ExecutionResult = [];
      // TODO: Proper handling of context. Node path needs updating each step. Bail when returned context says so.
      for (const choice of content) {
        const [result, nextContext] = processContent(choice);
        results.push(...result);
        currentContext = nextContext;
      }
      return [results, currentContext];
    }
    if (typeof content.type === "undefined") {
      throw new Error(
        "Undefined content type: \n" + JSON.stringify(content, null, "  ")
      );
    }
    switch (content.type) {
      case "text":
        return [[(content as ContentTextAST).text], currentContext];
      case "choices":
        const choices = (content as ContentChoiceAST).content;
        // TODO: If context path exists, follow it instead of using rng
        const chosen = rng.pick(choices, "weight");
        // TODO: Need to amend context as pathing into choice.
        return processContent(chosen.content);
      case "main":
      case "label": {
        // TODO: Need to amend context if pathing into label.
        const label = content as LabelAST;
        if (
          label.mode === "all" &&
          (label.content as ContentItemAST).type === "choices"
        ) {
          // Execute all choices
          // TODO: In parallel with bails
          const choices = label.content as ContentChoiceAST;
          const results = [];
          for (const choice of choices.content) {
            if (matchPreconditions(choice, currentContext)) {
              results.push(processContent(choice.content));
            }
          }
          // TODO: Combine executions in context
          return [results.flatMap((r) => r[0]), currentContext];
        }
        const result = processContent(label.content);
        if (content.type === "main") {
          // End of main with no bailout means we have finished
          if (!result[1].bail) {
            result[1].finished = true;
          }
        }
        if (label.mode === "set") {
          currentContext.state[label.name] = stringifyResult(result[0]);
        }
        return result;
      }
      case "substitution":
      case "assignment":
        const label = content as ContentSubstitutionAST;
        let found;
        if (content.type === "assignment") {
          if (content.type === "assignment") {
            currentContext.state[(content as ContentAssignmentAST).variable] =
              // TODO: We won't always want to stringify the result. Could assign a number, an entity,
              // a label ref, etc etc. Just automatically stringify if there are any text components,
              // maybe have an &= operator for storing references specifically.
              stringifyResult(
                processContent((content as ContentAssignmentAST).content)[0]
              );
          }
          found =
            currentContext.state[(content as ContentAssignmentAST).variable];
        } else {
          let labelName: string = label.label as string;
          if (typeof labelName === "object") {
            // TODO: More bail complications here
            const processed = processContent(label.label as ContentAST);
            labelName = stringifyResult(processed[0]);
          }
          if (
            Object.prototype.hasOwnProperty.call(
              currentContext.state,
              labelName
            )
          ) {
            found = currentContext.state[labelName];
          } else {
            // TODO: Index them
            found = main.labels.find((l) => l.name === labelName);
          }
        }
        let result;

        if (found === undefined) {
          return [[`<Error: Label ${label.label} not found>`], currentContext];
        }
        result =
          typeof found === "string"
            ? [found as string]
            : // TODO: Need to use the context from processContent if we bail
              (processContent(found)[0] as ExecutionResult);

        return [result, currentContext];
      case "external":
        const externalNode = content as ExternalAST;
        // TODO: Should also pass context and even yielded value; can return
        // an YieldInput if it wants to bail
        const returned = externalNode.callback(currentContext.state);
        return [returned, currentContext];
      // case "function":
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
        // TODO: If context path exists it is the result of the input
        currentContext.error = true;
        return [["Cannot process input"], currentContext];
      default:
        throw new Error(
          "Unknown content type in objecft: " +
            JSON.stringify(content, null, "  ")
        );
    }
  };
  let entryNode: ContentItemAST | undefined = main;
  if (entryPoint) {
    entryNode = main.labels.find((label) => label.name === entryPoint);
    if (!entryNode) {
      throw new Error("Entrypoint label not found: " + entryPoint);
    }
  }
  const result = processContent(entryNode);
  return result;
};

const ParsedTextTemplateIdentifier = Symbol("ParsedTextTemplate");

export type ParsedTextTemplate = {
  main: MainAST;
  render: (
    rng: RNG,
    variables?: Record<string, string>,
    entryPoint?: string
  ) => string;
  stream: (
    rng: RNG,
    variables?: Record<string, string>,
    executionContext?: ExecutionContext,
    entryPoint?: string
  ) => [ExecutionResult, ExecutionContext];
  [ParsedTextTemplateIdentifier]: true;
};

// export const merge = (...templates: ParsedTextTemplate[]) => {

// };

let externalIndex = 0;

export const text = (
  input: TemplateStringsArray,
  ...interpolations: any[]
): ParsedTextTemplate => {
  const externals: Record<string, LabelAST> = {};
  const mergedTemplates: ParsedTextTemplate[] = [];
  const flattened = input
    .map((fragment, i) => {
      if (interpolations[i]) {
        const external = interpolations[i];
        if (
          typeof external === "object" &&
          external[ParsedTextTemplateIdentifier]
        ) {
          mergedTemplates.push(external);
          // TODO: If the template has a main, we should actually still render it. Perhaps merging the labels
          // like this is not the way to go; if a template is merged mid-paragraph, the labels should only be applied
          // there, and not merged at top level...
          return fragment;
        }
        const labelName = "OUT" + externalIndex;
        externals[labelName] = external;
        return `${fragment}[$${labelName}]`;
      }
      return fragment;
    })
    .join("");
  const importLabels = createLabelsFromObject(externals);
  try {
    const main = parse(flattened, [
      ...mergedTemplates,
      { main: { labels: importLabels } } as ParsedTextTemplate,
    ]);

    return {
      main,
      render: (
        rng: RNG,
        variables?: Record<string, string>,
        entryPoint: string = ""
      ) => {
        // console.log(JSON.stringify(main, null, "  "));
        const stream = executeText(
          main,
          rng,
          variables,
          new ExecutionContext(),
          entryPoint
        );

        return stringifyResult(stream[0]);
      },
      stream: (
        rng: RNG,
        variables?: Record<string, string>,
        executionContext?: ExecutionContext,
        entryPoint: string = ""
      ) => executeText(main, rng, variables, executionContext, entryPoint),
      [ParsedTextTemplateIdentifier]: true,
    };
  } catch (e) {
    const errorContext = new ExecutionContext();
    errorContext.error = true;
    errorContext.finished = true;
    return {
      main: ERROR_MAIN,
      render: () => `<Error: ${e.message}>`,
      stream: () => [[`<Error: ${e.message}>`], errorContext],
      [ParsedTextTemplateIdentifier]: true,
    };
  }
};

import * as nearley from "nearley";
import { RNG } from "../useRng";
import { ExecutionContext } from "./ExecutionContext";

const grammar = require("./herotext.js");

type ReturnCommand = {
  type: "input";
};

type ExecutionResult = string | ReturnCommand | ExecutionResult[];

interface ContentItemAST {
  type:
    | "text"
    | "substitution"
    | "main"
    | "label"
    | "assignment"
    | "function"
    | "choices"
    | "input";
}

type ContentAST = ContentItemAST[] | ContentItemAST;

type ContentTextAST = ContentItemAST & {
  type: "text";
  text: string;
};

type ContentSubstitutionAST = ContentItemAST & {
  type: "substitution";
  label: string;
};

type ContentAssignmentAST = ContentItemAST & {
  type: "assignment";
  variable: string;
  content: ContentAST;
};

type FunctionInvocationAST = Omit<ContentSubstitutionAST, "type"> & {
  parameters: Record<string, ContentItemAST>;
};

type ChoiceAST = {
  type: "choice";
  weight: number;
  content: ContentAST;
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

type MainAST = {
  type: "main";
  content: ContentAST;
  labels: LabelAST[];
};

type LabelAST = Omit<MainAST, "type" | "labels"> & {
  type: "label";
  name: string;
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
  Object.entries(labels).map<LabelAST>(([key, value]) => ({
    type: "label",
    name: key,
    content:
      typeof value === "string"
        ? ({ type: "text", text: value } as ContentTextAST)
        : createChoicesFromObject(value),
  }));

export const parse = (input: string): MainAST => {
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
  if (main === undefined) {
    console.error("Undefined main:");
    console.error(input);
    console.error(parsed);
    throw new Error("Undefined main");
  }
  return main;
};

export const executeText = (
  main: MainAST,
  rng: RNG,
  variables?: Record<string, string>,
  externals: any[] = [],
  importLabels?: ImportLabels,
  executionContext?: ExecutionContext
): [ExecutionResult, ExecutionContext] => {
  const mergedLabels = importLabels
    ? [...main.labels, ...createLabelsFromObject(importLabels)]
    : main.labels;
  let currentContext: ExecutionContext = executionContext
    ? executionContext.clone()
    : new ExecutionContext(variables);
  const processContent = (
    content: ContentAST
  ): [ExecutionResult, ExecutionContext] => {
    if (Array.isArray(content)) {
      const results = [];
      // TODO: Proper handling of context. Node path needs updating each step. Bail when returned context says so.
      for (const choice of content) {
        const [result, nextContext] = processContent(choice);
        results.push(result);
        currentContext = nextContext;
      }
      return [results, currentContext];
    }
    switch (content.type) {
      case "text":
        return [(content as ContentTextAST).text, currentContext];
      case "choices":
        const choices = (content as ContentChoiceAST).content;
        // TODO: If context path exists, follow it instead of using rng
        const chosen = rng.pick(choices);
        // TODO: Need to amend context as pathing into choice.
        return processContent(chosen.content);
      case "main":
      case "label":
        // TODO: Need to amend context if pathing into label.
        return processContent((content as MainAST).content);
      case "substitution":
      case "assignment":
        const label = content as ContentSubstitutionAST;
        let found;
        if (content.type === "assignment") {
          if (content.type === "assignment") {
            currentContext.state[
              (content as ContentAssignmentAST).variable
            ] = processContent((content as ContentAssignmentAST).content)[0];
          }
          found =
            currentContext.state[(content as ContentAssignmentAST).variable];
        } else if (
          Object.prototype.hasOwnProperty.call(
            currentContext.state,
            label.label
          )
        ) {
          found = currentContext.state[label.label];
        } else {
          found = mergedLabels.find((l) => l.name === label.label);
        }
        let result;

        if (found === undefined) {
          return [`<Error: Label ${label.label} not found>`, currentContext];
        }
        result =
          typeof found === "string"
            ? (found as string)
            : // TODO: Need to use the context from processContent if we bail
              (processContent(found)[0] as ExecutionResult);

        return [result, currentContext];
      case "function":
        const functionNode = content as FunctionAST;
        switch (functionNode.name) {
          case "OUT":
            break;
        }
        currentContext.error = true;
        return [
          "Could not resolve function <" + functionNode.name + ">",
          currentContext,
        ];
      case "input":
        // TODO: If context path exists it is the result of the input
        currentContext.error = true;
        return ["Cannot process input", currentContext];
      default:
        throw new Error("Unknown content type: " + content.type);
    }
  };
  const result = processContent(main);
  return [result, currentContext];
};

export type ParsedTextTemplate = {
  main: MainAST;
  externals: any[];
  render: (
    rng: RNG,
    variables?: Record<string, string>,
    importLabels?: ImportLabels
  ) => string;
  stream: (
    rng: RNG,
    variables?: Record<string, string>,
    importLabels?: ImportLabels,
    executionContext?: ExecutionContext
  ) => [string, ExecutionContext];
};

export const text = (
  input: TemplateStringsArray,
  ...interpolations: any[]
): ParsedTextTemplate => {
  const flattened = input
    .map((fragment, i) => {
      if (interpolations[i]) {
        return `${fragment}<OUT(${i})>`;
      }
      return fragment;
    })
    .join("");
  try {
    const main = parse(flattened);
    const externals = interpolations.slice();

    return {
      main,
      externals,
      render: (
        rng: RNG,
        variables?: Record<string, string>,
        importLabels?: ImportLabels
      ) => {
        const stream = executeText(
          main,
          rng,
          variables,
          externals,
          importLabels
        );

        const stringifyResult = (element: ExecutionResult): string => {
          if (Array.isArray(element)) {
            return (element as ExecutionResult[]).map(stringifyResult).join("");
          }
          if (typeof element === "string") {
            return element;
          }
          return "";
        };

        return stringifyResult(stream as ExecutionResult);
      },
      stream: <S extends {}>(
        rng: RNG,
        variables?: Record<string, string>,
        importLabels?: ImportLabels,
        executionContext?: ExecutionContext
      ) =>
        executeText(
          main,
          rng,
          variables,
          externals,
          importLabels,
          executionContext
        ),
    };
  } catch (e) {
    const errorContext = new ExecutionContext();
    errorContext.error = true;
    errorContext.finished = true;
    return {
      main: ERROR_MAIN,
      externals: [],
      render: () => `<Error: ${e.message}>`,
      stream: () => [`<Error: ${e.message}>`, errorContext],
    };
  }
};

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
    | "choices";
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

type ContentAssignmentAST = Omit<ContentSubstitutionAST, "type"> & {
  type: "assignment";
  variable: string;
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
  choices: ChoiceAST[];
};

type LabelAST = Omit<ContentChoiceAST, "type"> & {
  type: "label";
  name: string;
};

type FunctionASTParameter = {
  name: string;
  defaultValue: ContentItemAST;
};

type FunctionAST = Omit<LabelAST, "type"> & {
  type: "function";
  parameters: FunctionASTParameter[];
};

type MainAST = Omit<ContentChoiceAST, "type"> & {
  type: "main";
  labels: LabelAST[];
};

type ImportLabels = Record<string, string | ChoiceAST[]>;

const ERROR_MAIN: MainAST = {
  type: "main",
  choices: [],
  labels: [],
};

const createLabelsFromObject = (labels: ImportLabels) =>
  Object.entries(labels).map<LabelAST>(([key, value]) => ({
    type: "label",
    name: key,
    choices:
      typeof value === "string"
        ? [
            {
              type: "choice",
              content: { type: "text", text: value } as ContentTextAST,
              weight: 10,
            } as ChoiceAST,
          ]
        : ((Array.isArray(value) ? value : [value]) as ChoiceAST[]),
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
      case "main":
      case "label":
        const choices = (content as ContentChoiceAST).choices;
        // TODO: If context path exists, follow it instead of using rng
        const chosen = rng.pick(choices);
        // TODO: Need to amend context as pathing into label.
        return processContent(chosen.content);
      case "substitution":
      case "assignment":
        const label = content as ContentSubstitutionAST;
        let found;
        if (
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
        if (content.type === "assignment") {
          if (content.type === "assignment") {
            currentContext.state[
              (content as ContentAssignmentAST).variable
            ] = result;
          }
        } else {
          if (found === undefined) {
            return [`<Error: Label ${label.label} not found>`, currentContext];
          }
          result =
            typeof found === "string"
              ? (found as string)
              : // TODO: Need to use the context from processContent if we bail
                (processContent(found)[0] as ExecutionResult);
        }
        return [result, currentContext];
      case "function":
        const functionNode = content as FunctionAST;
        switch (functionNode.name) {
          case "OUT":
            break;
        }
        return "Could not resolve function <" + functionNode.name + ">";
      case "input":
        // TODO: If context path exists it is the result of the input
        return "????";

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
    return {
      main: ERROR_MAIN,
      externals: [],
      render: () => `<Error: ${e.message}>`,
      stream: () => [
        `<Error: ${e.message}>`,
        { state: {}, currentNodePath: [], finished: true, error: true },
      ],
    };
  }
};

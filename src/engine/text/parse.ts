import * as nearley from "nearley";
import { RNG } from "../useRng";

const grammar = require("./herotext.js");

interface ContentItemAST {
  type: "text" | "substitution" | "choices" | "main" | "label" | "assignment";
}

type ContentAST = ContentItemAST[] | ContentItemAST;

type ContentTextAST = ContentItemAST & {
  type: "text";
  text: string;
};

type ContentChoiceAST = {
  type: "choices";
  choices: ChoiceAST[];
};

type ContentSubstitutionAST = ContentItemAST & {
  type: "substitution";
  label: string;
};

type ContentAssignmentAST = ContentSubstitutionAST & {
  type: "assignment";
  variable: string;
};

type ChoiceAST = {
  type: "choice";
  weight: number;
  content: ContentAST;
};

type LabelAST = Omit<ContentChoiceAST, "type"> & {
  type: "label";
  name: string;
};

type MainAST = ContentChoiceAST & {
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
    parsed = parser.feed(input);
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

type ExecutionContext = {
  state: any;
  currentNodePath: string;
};

export const executeText = (
  main: MainAST,
  rng: RNG,
  variables: Record<string, string> = {},
  externals: any[] = [],
  importLabels?: ImportLabels,
  executionContext?: ExecutionContext
) => {
  let mergedLabels = importLabels
    ? [...main.labels, ...createLabelsFromObject(importLabels)]
    : main.labels;
  const processContent = (content: ContentAST): string => {
    if (Array.isArray(content)) {
      return content.map((choice) => processContent(choice)).join("");
    }
    switch (content.type) {
      case "text":
        return (content as ContentTextAST).text;
      case "choices":
      case "main":
      case "label":
        const choices = (content as ContentChoiceAST).choices;
        const chosen = rng.pick(choices);
        return processContent(chosen.content);
      case "substitution":
      case "assignment":
        const label = content as ContentSubstitutionAST;
        let found;
        if (Object.prototype.hasOwnProperty.call(variables, label.label)) {
          found = variables[label.label];
        } else {
          found = mergedLabels.find((l) => l.name === label.label);
        }
        if (found === undefined) {
          return `<Error: Label ${label.label}not found>`;
        }
        const result =
          typeof found === "string" ? found : processContent(found);
        if (content.type === "assignment") {
          variables[(content as ContentAssignmentAST).variable] = result;
        }
        return result;
      case "function":
        const functionNode = content as FunctionAST;
        switch (functionNode.name) {
          case "OUT":
            break;
        }
      default:
        throw new Error("Unknown content type: " + content.type);
    }
  };
  return processContent(main);
};

export const streamText = (
  main: MainAST,
  rng: RNG,
  variables: Record<string, string> = {},
  externals: any[] = [],
  importLabels?: ImportLabels,
  executionContext?: ExecutionContext
) => {};

export type ParsedTextTemplate = {
  main: MainAST;
  externals: any[];
  render: (
    rng: RNG,
    variables?: Record<string, string>,
    importLabels?: ImportLabels
  ) => string;
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
      ) => executeText(main, rng, variables, externals, importLabels),
      stream: <S extends {}>(
        rng: RNG,
        currentState: S,
        variables?: Record<string, string>,
        importLabels?: ImportLabels
      ) => executeText(main, rng, currentState, externals, importLabels),
    };
  } catch (e) {
    return {
      main: ERROR_MAIN,
      externals: [],
      render: () => `<Error: ${e.message}>`,
    };
  }
};

import * as nearley from "nearley";
import { RNG } from "./rng";
import { ExecutionContext } from "./ExecutionContext";
import isFunction from "lodash/isFunction";
import { ReturnCommand, ExecutionResult } from "./types";
import { executeText } from "./execute";
import {
  ContentItemAST,
  ContentTextAST,
  ExternalAST,
  ExecutionResultItem,
} from "./types";
import {
  MainAST,
  ContentAST,
  ChoiceAST,
  ContentChoiceAST,
  LabelAST,
} from "./types";

const grammar = require("./herotext.js");

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

const createLabelsFromObject = (labels: Record<string, LabelAST>) =>
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

export const stringifyResult = (elements: ExecutionResultItem[]): string => {
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
  ) => ExecutionResult;
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
    const errorContext = new ExecutionContext({});
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

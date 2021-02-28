import isFunction from "lodash/isFunction";
import * as nearley from "nearley";
import { RNG } from "./rng";
import { ExecutionContext } from "./ExecutionContext";
import {
  ReturnCommand,
  ExecutionResult,
  ContentTextAST,
  ExternalAST,
  ExecutionResultItem,
  MainAST,
  ContentAST,
  ChoiceAST,
  ContentChoiceAST,
  LabelAST,
} from "./types";
import grammar from "./herotext";

const errorMain = (message: string): MainAST => ({
  type: "main",
  content: [{ type: "text", text: message } as ContentTextAST],
  labels: {},
});

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

export const parse = (input: string): MainAST => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
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
  if (Object.keys(main.labels).some((name) => name.startsWith("OUT"))) {
    console.error("Labels beginning with OUT are reserved for external calls:");
    console.error(input);
    console.error(parsed);
    throw new Error(
      "Labels beginning with OUT are reserved for external calls"
    );
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

export const merge = (...mains: MainAST[]) => {
  const newMain: MainAST = {
    type: "main",
    content: null,
    labels: {},
  };
  for (const main of mains) {
    if (main.content !== null) {
      newMain.content = main.content;
    }
    newMain.labels = { ...newMain.labels, ...main.labels };
  }
  return newMain;
};

let externalIndex = 0;

export const text = (
  input: TemplateStringsArray,
  ...interpolations: any[]
): MainAST => {
  const externals: Record<string, LabelAST> = {};
  const mergedTemplates: MainAST[] = [];
  const flattened = input
    .map((fragment, i) => {
      if (interpolations[i]) {
        const external = interpolations[i];
        if (
          // TODO: Hmm, not the best way to determine this. Could start using more complex strings
          // for types? e.g. "Herotext::MainAST". Also could still decorate all the ASTs with a symbol I guess...
          typeof external === "object" &&
          external.type === "main"
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
  try {
    const main = merge(...mergedTemplates, parse(flattened), {
      type: "main",
      content: null,
      labels: externals,
    });
    return main;
  } catch (e) {
    return errorMain(e.message);
  }
};

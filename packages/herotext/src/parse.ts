import isFunction from "lodash/isFunction";
import * as nearley from "nearley";
import { RNG } from "./rng";
import { ExecutionContext } from "./ExecutionContext";
import {
  ExecutionResult,
  ContentTextAST,
  ExternalAST,
  ExecutionResultItem,
  MainAST,
  ContentAST,
  ChoiceAST,
  ContentChoiceAST,
  LabelAST,
  ScopeValue,
} from "./types";
import grammar from "./herotext";
import {
  ComplexValue,
  StateElement,
  PrimitiveValue,
  TypedValue,
} from "./types";
import { stringify } from "flatted";
import { Vector, isVector } from "./vector";
import { ContentItemAST } from "../dist/src/types";

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

// TODO: This should in fact be used in a modified form, but it'll be more like `createScopeFromValues`
const createLabelFromObject = (key: string, value: any): LabelAST => {
  let content: ContentAST | ScopeValue;

  if (value === null || typeof value === "undefined") {
    content = { type: "text", text: "" } as ContentTextAST;
  } else if (typeof value === "string") {
    content = { type: "text", text: value } as ContentTextAST;
  } else if (typeof value === "number" || typeof value === "boolean") {
    // TODO: Should be primitive scope types
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
  } else if (value.type) {
    // TODO: More thorough checks whether it's a valid AST or ScopeValue
    content = value as ContentAST;
  } else if (typeof value === "object") {
    content = {
      type: "complex",
      value,
    } as ComplexValue;
  } else {
    throw new Error(
      `Cannot handle external type (${typeof value}): ${JSON.stringify(value)}`
    );
  }
  return {
    type: "label",
    mode: "label",
    name: key,
    external: true,
    merge: false,
    content,
  };
};

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
  const main: MainAST = parsed.results[0]
    ? ((parsed.results[0] as unknown) as MainAST)
    : { type: "main", content: null, labels: {} };
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

const stringifyResultItem = (element: ExecutionResultItem): string => {
  if (element === null) {
    return "";
  }
  if (typeof element === "undefined") {
    return "<undefined>";
  }
  if (typeof element === "string") {
    return element;
  }
  if (typeof element === "number" || typeof element === "boolean") {
    return (element as number).toString();
  }
  if (Array.isArray(element)) {
    return element.map(stringifyResultItem).join("");
  }
  if (isVector(element)) {
    const { x, y } = element as Vector;
    return "<" + x + "," + y + ">";
  }
  if (typeof element === "object") {
    const typed = element as TypedValue;
    switch (typed.type) {
      case "complex":
        return stringify(typed.value, null, "  ");
    }
  }
  return `<Error: Not stringifiable ${stringify(element, null, "  ")}>`;
};

export const stringifyResult = (elements: ExecutionResultItem[]): string => {
  return elements.map(stringifyResultItem).join("");
};

// TODO: Figure out how scope values work and start supporting non-strings
export const coalesceResult = (elements: ExecutionResultItem[]): ScopeValue => {
  const flattened: ScopeValue[] = [];
  for (const element of elements) {
    if (Array.isArray(element)) {
      const sub = coalesceResult(element as ExecutionResultItem[]);
      flattened.push(sub);
    } else if (
      typeof element === "string" ||
      typeof element === "number" ||
      typeof element === "boolean"
    ) {
      flattened.push(element);
    } else if (isVector(element)) {
      flattened.push(element as Vector);
    } else if (element && (element as TypedValue).type !== "input") {
      flattened.push((element as PrimitiveValue).value as ScopeValue);
    } else {
      flattened.push(stringifyResultItem(element));
    }
  }
  if (flattened.length === 1) {
    return flattened[0];
  }
  // Multiple results, all that really makes sense is stringifying
  // TODO: (well... maybe we actually want to return a list, if it was an array *primitive*
  return elements.map(stringifyResultItem).join("");
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

export const text = <T = Record<string, any>>(
  input: TemplateStringsArray,
  ...interpolations: (
    | ((
        state: T,
        context: ExecutionContext
      ) => ExecutionResultItem | ExecutionResultItem[] | void | undefined)
    | StateElement
    | MainAST
  )[]
): MainAST => {
  const externals: Record<string, LabelAST> = {};
  const mergedTemplates: MainAST[] = [];
  const flattened = input
    .map((fragment, i) => {
      if (interpolations[i]) {
        const external = interpolations[i];
        // TODO: Maybe do some more checking of types (like heromaps does) and inline strings
        if (
          // TODO: Hmm, not the best way to determine this. Could start using more complex strings
          // for types? e.g. "Herotext::MainAST". Also could still decorate all the ASTs with a symbol I guess...
          typeof external === "object" &&
          (external as ContentItemAST).type === "main"
        ) {
          const main = external as MainAST;
          mergedTemplates.push(main);
          // TODO: if a template is merged mid-paragraph, the labels should stay
          // there, and not merged at top level... really hard to do when the text hasn't been parsed yet ...
          // unless we use Nearley's streaming parser which would actually help with some other contextual
          // stuff as well. Actually could wait until *after* the parsing to then merge labels, will be
          // able to tell if they're at root level. Later.
          // If there is no content, don't bother embedding it.
          if (
            !main.content ||
            (Array.isArray(main.content) && main.content.length === 0)
          ) {
            return fragment;
          }
        }
        const labelName = "OUT" + externalIndex;
        externalIndex++;
        externals[labelName] = createLabelFromObject(labelName, external);
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

import isFunction from "lodash/isFunction";
import { ExecutionContext } from "./ExecutionContext";
import { merge, parse } from "./parse";
import { ExecutionStrand } from "./types";
import {
  ContentTextAST,
  ExternalAST,
  ComplexValue,
  ExecutionResultItem,
  StateElement,
  MainAST,
  ContentAST,
  ChoiceAST,
  ContentChoiceAST,
  LabelAST,
  ScopeValue,
  ContentItemAST,
} from "./types";

// TODO: Not sure how pointful this is. Better to let the error throw and get the log.
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

// TODO: Assign ids on a symbol key instead to not duplicate things
let externalIndex = 0;

export const text = <T extends {}>(
  input: TemplateStringsArray,
  ...interpolations: (
    | ((
        state: T,
        context: ExecutionContext,
        strand: ExecutionStrand
      ) => ExecutionResultItem | ExecutionResultItem[] | void | undefined)
    | StateElement
    | MainAST
    | undefined
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

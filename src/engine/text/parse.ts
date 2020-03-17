import * as nearley from "nearley";
import { RNG } from "../useRng";

const grammar = require("./herotext.js");

interface ContentItemAST {
  type: "text" | "substitution" | "choices" | "main" | "label";
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

type AdditionalLabels = Record<string, string | ChoiceAST[]>;

export type ParsedText = (
  rng: RNG,
  additionalLabels?: AdditionalLabels
) => string;

const createLabelsFromObject = (labels: AdditionalLabels) =>
  Object.entries(labels).map<LabelAST>(([key, value]) => ({
    type: "label",
    name: key,
    choices:
      typeof value === "string"
        ? [
            {
              type: "choice",
              content: { type: "text", text: value } as ContentTextAST,
              weight: 10
            } as ChoiceAST
          ]
        : ((Array.isArray(value) ? value : [value]) as ChoiceAST[])
  }));

export const parse = (input: string): ParsedText => {
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
    return () => "<Error: Unparseable text>";
  }
  const main = (parsed.results[0] as unknown) as MainAST;
  if (main === undefined) {
    console.error("Undefined main:");
    console.error(input);
    console.error(parsed);
    return () => "<Error: Undefined main>";
  }
  const execute = (rng: RNG, additionalLabels?: AdditionalLabels) => {
    let mergedLabels = additionalLabels
      ? [...main.labels, ...createLabelsFromObject(additionalLabels)]
      : main.labels;
    const processContent = (content: ContentAST): string => {
      if (Array.isArray(content)) {
        return content.map(choice => processContent(choice)).join("");
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
          const label = content as ContentSubstitutionAST;
          const found = mergedLabels.find(l => l.name === label.label);
          if (!found) {
            return `<Error: Label ${label.label}not found>`;
          }
          return processContent(found);
        default:
          throw new Error("Unknown content type: " + content.type);
      }
    };
    return processContent(main);
  };
  return execute;
};

export const text = (input: TemplateStringsArray, ...interpolations: any[]) => {
  const flattened = input
    .map(value => {
      return value;
    })
    .join("");
  return parse(flattened);
};

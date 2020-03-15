import * as nearley from "nearley";
import { RNG } from "../useRng";
const grammar = require("./herotext.js");

type ContentItemAST = {
  type: "text" | "substitution" | "choices" | "main" | "label";
};

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

type LabelAST = ContentItemAST & {
  type: "label";
  name: string;
};

type MainAST = ContentChoiceAST & {
  type: "main";
  labels: LabelAST[];
};

export const parse = (input: string) => {
  console.log(grammar);
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammar as nearley.CompiledRules)
  );
  const parsed = parser.feed(input);
  console.log(parsed.results[0]);
  const main = (parsed.results[0] as unknown) as MainAST;
  const execute = (rng: RNG) => {
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
          const found = main.labels.find(l => l.name === label.label);
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

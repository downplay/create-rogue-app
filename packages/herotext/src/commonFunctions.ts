import { text } from "./parse";

const vowels = ["a", "e", "i", "o", "u"];

// TODO: some dictionary of "an" h-words like hour?
const usesAnForm = (word: string) => vowels.includes(word[0]);

type AProps = {
  word: string;
  start?: number;
  end?: number;
};

const titleCase = (word: string) => word[0].toLocaleUpperCase() + word.slice(1);

const pluralise = (word: string) =>
  word[word.length - 1] === "s" ? word + "es" : word + "s";

export const commonFunctions = text`
a: ($word)
${({ word }: AProps) => (usesAnForm(word) ? "an" : "a")} $word

title: ($word)
${({ word }: AProps) => titleCase(word)}

plural: ($word)
${({ word }: AProps) => pluralise(word)}

slice: ($word,$start?,$end?)
${({ word, start, end }: AProps) => {
  const result = word.slice(
    typeof start === "undefined" ? undefined : Number(start),
    typeof end === "undefined" ? undefined : Number(end)
  );
  return result;
}}

null:
{}
`;
// ^ weird hack to allow a null entry.
// TODO: Implement comments

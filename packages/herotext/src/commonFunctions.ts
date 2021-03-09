import { text } from "./text";

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

export const commonFunctions = text<AProps>`
a: ($word)
${({ word }) => (usesAnForm(word) ? "an" : "a")} $word

title: ($word)
${({ word }) => titleCase(word)}

lower: ($word)
${({ word }) => word.toLocaleLowerCase()}

plural: ($word)
${({ word }) => pluralise(word)}

slice: ($word,$start?,$end?)
${({ word, start, end }) => {
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

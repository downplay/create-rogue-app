import { text } from "./parse";

const vowels = ["a", "e", "i", "o", "u"];

// TODO: some dictionary of "an" h-words like hour?
const usesAnForm = (word: string) => vowels.includes(word[0]);

type AProps = {
  word: string;
};

const titleCase = (word: string) => word[0].toLocaleUpperCase() + word.slice(1);

export const commonFunctions = text`
a($word):
${({ word }: AProps) => (usesAnForm(word) ? "an" : "a")} $word

title($word):
${({ word }: AProps) => titleCase(word)}

null:
!
`;

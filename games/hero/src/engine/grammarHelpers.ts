import { text } from "../../../../packages/herotext/src/text";

export const grammarHelpers = text`
conjugate: ($ifSelf, $ifOther)
{$isPlayer?}$ifSelf
{:}$ifOther
`;

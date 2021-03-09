import { text } from "herotext";

export const grammarHelpers = text`
conjugate: ($ifSelf, $ifOther)
{$isPlayer?}$ifSelf
{:}$ifOther
`;

import { text } from "herotext";

// TODO: Not really an engine thing, maybe a language module?

export const grammarHelpers = text`
conjugate: ($ifSelf, $ifOther)
{$isPlayer?}$ifSelf
{:}$ifOther
`;

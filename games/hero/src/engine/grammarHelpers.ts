import { text } from "@hero/text";

// TODO: Not really an engine thing, maybe a language module?

export const grammarHelpers = text`
conjugate: ($ifSelf, $ifOther)
{$isPlayer?}$ifSelf
{:}$ifOther

the: ($target)
{$Name==$Type}The $lower($Name)
{0}$Name
`;

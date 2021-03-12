import { text } from "herotext";
import { monster } from "../../monsters/baseMonster";

// TODO: depending on biome ...
// wearing shades / swimwear
// thick furs
// building a snowman
// ...snowmage!

export const maleMageVariants = text`🧙‍♂️|🧙🏻‍♂️|🧙🏼‍♂️|🧙🏽‍♂️|🧙🏾‍♂️|🧙🏿‍♂️`;

export const femaleMageVariants = text`🧙‍♀️|🧙🏻‍♀️|🧙🏼‍♀️|🧙🏽‍♀️|🧙🏾‍♀️|🧙🏿‍♀️`;

export const Mage = monster(text`
Tile:=
${maleMageVariants}
${femaleMageVariants}
`);

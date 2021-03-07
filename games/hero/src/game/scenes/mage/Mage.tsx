import { text } from "herotext";
import { entity } from "../../../engine/entity";

// TODO: depending on biome ...
// wearing shades / swimwear
// thick furs
// building a snowman
// ...snowmage!

export const maleMageVariants = text`🧙‍♂️|🧙🏻‍♂️|🧙🏼‍♂️|🧙🏽‍♂️|🧙🏾‍♂️|🧙🏿‍♂️`;

export const femaleMageVariants = text`🧙‍♀️|🧙🏻‍♀️|🧙🏼‍♀️|🧙🏽‍♀️|🧙🏾‍♀️|🧙🏿‍♀️`;

export const Mage = entity(text`
Tile:=
${maleMageVariants}
${femaleMageVariants}

${baseMonster}
`);

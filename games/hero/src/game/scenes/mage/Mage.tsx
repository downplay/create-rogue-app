import { Monster } from "../../meta/Monster";
import { entity } from "../../../engine/entity";

// TODO: depending on biome ...
// wearing shades / swimwear
// thick furs
// building a snowman
// ...snowmage!

const maleVariants = ["🧙‍♂️", "🧙🏻‍♂️", "🧙🏼‍♂️", "🧙🏽‍♂️", "🧙🏾‍♂️", "🧙🏿‍♂️"];

const femaleVariants = ["🧙‍♀️", "🧙🏻‍♀️", "🧙🏼‍♀️", "🧙🏽‍♀️", "🧙🏾‍♀️", "🧙🏿‍♀️"];

export const Mage = entity(() => {
  // TODO: NPC
  return <Monster></Monster>;
});

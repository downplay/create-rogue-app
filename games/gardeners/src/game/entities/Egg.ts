// Maybe an AncientEgg is similar to Egg but will hatch stuff like dinosaurs, unicorns...

import { defineEntity } from "../../engine/entity"

export const Egg = defineEntity("Egg", () => {
    // onModify(({ modifier }) => {
    //     // Pseudo code
    //     // If modifier is a lizard, hatch a baby dinosaur/dragon
    //     // If modifier is wings, hatch
    // })
})

export const EggItem = defineEntity("EggItem", () => {
    // isItem();
    // canDeploy(Egg);
    // isModifiable(() => {
    //   // Playing an egg on a living entity causes them to
    //   // lay an egg that will spawn a similar entity?
    //   // Or is it just a health bonus?
    // });
})

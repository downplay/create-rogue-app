import { RenderModule, defineActor } from "../../model/actor"
import { EquipmentModule } from "../../model/equip"
import { ItemModule } from "../../model/item"
import { SwordRender } from "./SwordRender"

// TODO: Generate random stats and reflect in sword look. Show on tooltip.

export const SwordItem = defineActor("Sword", [
    [RenderModule, { renderer: SwordRender }],
    [ItemModule, { stackable: false }],
    [
        EquipmentModule,
        {
            // TODO: This schema doesn't quite allow for if we want something to behave
            // differently in a different slot.
            slot: ["left", "right"],
            // requirements: [{type:"level", minimum: 10}],
            effects: [
                {
                    type: "attack",
                    // Attacks should be defined in a defineAttack(...) kind of way
                    // and add a bunch more things like how to calculate the final power
                    // from the weapon level, its material etc.
                    attack: {
                        type: "slice",
                        length: 2,
                        activate: 1,
                        power: 2
                    }
                }
                // TODO: An item effect that applies the given module on the equipper as long
                // as the item is equipped. Should work with rehydration. We could also have modules
                // on the item itself that only activate when item equipped; we just need to cut
                // equipped items into the game loop.
                // {
                //   type: "module",
                //   module: module,
                //   opts: {}
                // }
            ]
        }
    ]
])

import { RenderModule, defineActor } from "../../model/actor"
import { ItemModule } from "../../model/item"
import { SwordRender } from "./SwordRender"

// TODO: Generate random stats and reflect in sword look. Show on tooltip.

export const SwordItem = defineActor("Sword", [
    [RenderModule, { renderer: SwordRender }],
    [ItemModule, { stackable: false }]
])

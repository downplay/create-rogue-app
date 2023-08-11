import { defineActor, HealthModule, RenderModule, SpeedModule } from "../../model/actor"
import { MovementModule, WanderingModule } from "../../model/movement"
import { BubbleRender } from "./BubbleRender"

export const BubbleMonster = defineActor("Bubble", [
    [RenderModule, { renderer: BubbleRender }],
    [SpeedModule, { base: 1 }],
    HealthModule,
    // [LocationModule],
    MovementModule,
    WanderingModule
])

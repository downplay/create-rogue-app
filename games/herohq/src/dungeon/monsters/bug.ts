import { defineActor, HealthModule, RenderModule, SpeedModule } from "../../model/actor"
import { MovementModule, WanderingModule } from "../../model/movement"
import { BugRender } from "./BugRender"

export const BugMonster = defineActor("Bug", [
    [RenderModule, { renderer: BugRender }],
    [SpeedModule, { base: 2 }],
    HealthModule,
    // [LocationModule],
    MovementModule,
    WanderingModule
])

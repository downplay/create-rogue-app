import { defineActor, RenderModule } from "../../model/actor"
import { MovementModule, WanderingModule } from "../../model/movement"
import { BugRender } from "./BugRender"

export const BugMonster = defineActor("Bug", [
    [RenderModule, { renderer: BugRender }],
    // [LocationModule],
    MovementModule,
    WanderingModule
])

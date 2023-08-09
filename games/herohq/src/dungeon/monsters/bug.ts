import { defineActor } from "../../model/actor"
import { BugRender } from "./BugRender"

export const BugMonster = defineActor("Bug", [
    locationModule,
    movementModule,
    vitalsModule,
    [RenderModule, { renderer: BugRender }]
])

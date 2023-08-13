import { defineActor, RenderModule, SpeedModule } from "../../model/actor"
import { EnemyModule } from "../../model/enemy"
import { HealthModule } from "../../model/health"
import { MovementModule, WanderingModule } from "../../model/movement"
import { BugRender } from "./BugRender"

export const BugMonster = defineActor("Bug", [
    [RenderModule, { renderer: BugRender }],
    [SpeedModule, { base: 2 }],
    HealthModule,
    // [LocationModule],
    MovementModule,
    WanderingModule,
    EnemyModule
])

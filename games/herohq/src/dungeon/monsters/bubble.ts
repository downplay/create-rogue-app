import { defineActor, RenderModule, SpeedModule } from "../../model/actor"
import { EnemyModule } from "../../model/enemy"
import { HealthModule } from "../../model/health"
import { MovementModule, WanderingModule } from "../../model/movement"
import { BubbleRender } from "./BubbleRender"

export const BubbleMonster = defineActor("Bubble", [
    [RenderModule, { renderer: BubbleRender }],
    [SpeedModule, { base: 1 }],
    // High health, low damage
    [HealthModule, { multiplier: 4 }],
    // [LocationModule],
    MovementModule,
    // [FightModule, { /* define attacks, attack power, but how can we change them dynamically? */ }]
    EnemyModule,
    WanderingModule
])

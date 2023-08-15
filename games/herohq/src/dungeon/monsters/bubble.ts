import { defineActor, RenderModule, SpeedModule } from "../../model/actor"
import { DeathModule, DropTable } from "../../model/death"
import { EnemyModule } from "../../model/enemy"
import { HealthModule } from "../../model/health"
import { ItemData, ItemModule } from "../../model/item"
import { MovementModule, WanderingModule } from "../../model/movement"
import { CoinItem } from "../items/CoinItem"
import { BubbleRender, BubbleCorpseRender } from "./BubbleRender"

const BubbleCorpse = defineActor("BubbleCorpse", [[RenderModule, { renderer: BubbleCorpseRender }]])

const BubbleFluid = defineActor("BubbleFluid", [
    [
        ItemModule,
        // TODO: Maybe fluids are a distinct type of item, continuous vs discrete quantities?
        { stackable: true }
    ]
])

const BubbleDrops: DropTable = [
    // TODO: OK so ... what we want to be able to say is, "1 or more of these, depending on luck,
    // then each of these have a value of normal(x) also weighted by luck, boosted by monster
    // level, and boosted by anything else like hero traits or deities (e.g. gold god will
    // specifically boost coin drops)"
    [CoinItem, 1 / 2, [[ItemData, { amount: 10 }]]] // ({ rng }) => ({})]]
    // [HealthItem, 1 / 5],
    // [SpiritItem, 1 / 8],
    // [BubbleFluid, 1 / 10]
]

export const BubbleMonster = defineActor("Bubble", [
    [RenderModule, { renderer: BubbleRender }],
    [SpeedModule, { base: 1 }],
    // High health, low damage
    [HealthModule, { multiplier: 4 }],
    // [LocationModule],
    MovementModule,
    // [FightModule, { /* define attacks, attack power, but how can we change them dynamically? */ }]
    EnemyModule,
    WanderingModule,
    // TODO: Just a thought. For bubbles specifically it could be fun if the drop items are already spawned and just floating
    // around inside the bubble where we can see them but can't take them until it dies.
    [
        DeathModule,
        {
            corpse: BubbleCorpse,
            drops: BubbleDrops
        }
    ]
])

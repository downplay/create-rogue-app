import { defineData, defineModule } from "./actor"
import { DieAction } from "./death"
import { ReceiveHitAction } from "./fight"
import { LevelData } from "./level"
import { CancelAction } from "./player"

const CurrentHealthData = defineData("CurrentHealth", 1)

type HealthModuleOpts = {
    multiplier?: number
}

const MaxHealthModule = defineModule<HealthModuleOpts, number>(
    "MaxHealth",
    ({ multiplier = 1 }, { id, get }) => {
        const level = get(LevelData)
        // TODO: Hero will have a series of upgrades which may affect health as well as
        // body stat, equips and temporary effects
        return Math.ceil((10 + level * 2) * multiplier)
    }
)

export const HealthModule = defineModule(
    "Health",
    (_, { id, get }) => {
        const maximum = get(MaxHealthModule)
        const fraction = get(CurrentHealthData)
        return {
            amount: Math.round(fraction * maximum),
            fraction,
            maximum
        }
    },
    (_, { handle, set, self, dispatch }) => {
        // TODO: Don't know if this is the right place to proc the hit. Certainly creates a circular ref.
        // Maybe proc in a Fight module and then handle a pure TakeDamageAction instead.
        handle(ReceiveHitAction, ({ source, attack, power }) => {
            const current = self()
            // TODO: Apply defence and so on
            const next = Math.max(0, current.amount - power)
            const fraction = next / current.maximum

            set(CurrentHealthData, fraction)
            if (next === 0) {
                // TODO: Think about what here. Rather than having to guard every single module
                // checking for death, we need to do one of two things 1) spawn a separate corpse
                // entity with a different module configuration, problem is we have to do this
                // for every single actor type with a different corpse entity. 2) reconfigure the
                // modules in realtime, remove ones that aren't appropriate for live monster,
                // add a ragdoll module, and a loot module. A corpse behaves a bit liek a chest actually.
                // It is tempting. Also think about how we would revive a corpse as a zombie.
                dispatch(CancelAction, undefined)
                dispatch(DieAction, { killer: source })
            }
        })
    }
)

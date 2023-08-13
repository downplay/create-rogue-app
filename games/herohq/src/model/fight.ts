import { GameLoopAction, LocationData, defineAction, defineData, defineModule } from "./actor"
import { gameTimeTicksAtom } from "./game"
import { WalkToAction } from "./movement"
import { CancelAction } from "./player"

export const AttackTargetAction = defineAction<{
    target: string
}>("AttackTarget")

export const AttackTargetData = defineData<{
    target?: string
}>("AttackTarget", {})

type Attack = {
    type: "swing" | "stab" | "chop"
    length: number
    activate: number
}

export const AttackData = defineData<{
    attack?: Attack
    start: number
    speed: number
    activated: boolean
}>("Attack", {
    start: 0,
    speed: 1,
    activated: false
})

export const ReceiveHitAction = defineAction<{ source: string; attack: Attack; power: number }>(
    "ReceiveHit"
)

export const FightModule = defineModule(
    "Fight",
    (_, { get }) => {
        // TODO: Maybe also a status as in "moving to" vs "fighting"
        // We would use this status to colour a theoretical path line on the floor, as well as show
        // hero status in the roster. Status can be set by a few different modules; need to work out
        // a system for this kind of data as we also need something to allow overriding/mutating stat
        // values for things like potion or spell effects
        return get(AttackTargetData)
    },
    (_, { id, handle, set, get, getAtom, dispatch, rng }) => {
        const powerNormal = rng.normal()

        const attack = (target: string) => {
            //TODO: we need different types of attack, an attack timeline, depends on weapons
            const current = get(AttackData)
            const time = getAtom(gameTimeTicksAtom)
            if (!current.attack) {
                set(AttackData, {
                    attack: {
                        type: "swing",
                        length: 1,
                        activate: 0.8
                    },
                    start: time,
                    // TODO: Roll for speed and also apply speedmodule
                    speed: 1,
                    activated: false
                })
            } else if (
                !current.activated &&
                time > current.start + current.attack.activate / current.speed
            ) {
                const power = Math.max(0, Math.ceil(powerNormal() * 10))
                if (power > 0) {
                    dispatch(ReceiveHitAction, { source: id, attack: current.attack, power })
                } else {
                    // visually represent a miss
                    // bad misses based on high negative could make player vulnerable
                    // monster blocks could also trigger vuln, separately
                }
                set(AttackData, (data) => ({ ...data, activated: true }))
            } else if (time > current.start + current.attack.length / current.speed) {
                set(AttackData, { start: 0, speed: 1, activated: false })
            }
        }

        const attackOrMove = (target: string) => {
            const location = get(LocationData)
            const targetLocation = get(LocationData, target)
            // TODO: Should be a helper (exists in heromath?)
            const distanceTo = Math.sqrt(
                Math.pow(targetLocation.position.x - location.position.x, 2) +
                    Math.pow(targetLocation.position.y - location.position.y, 2)
            )
            if (distanceTo <= 1) {
                dispatch(WalkToAction, { target: location.position })
                // Fight
                attack(target)
            } else {
                dispatch(WalkToAction, { target: targetLocation.position })
            }
        }

        handle(CancelAction, () => {
            set(AttackTargetData, {})
        })
        handle(AttackTargetAction, ({ target }) => {
            set(AttackTargetData, { target })
            attackOrMove(target)
        })
        handle(GameLoopAction, () => {
            const { target } = get(AttackTargetData)
            if (target) {
                attackOrMove(target)
            }
        })
    }
)

import {
    LocationData,
    actorFamily,
    defineAction,
    defineData,
    defineModule,
    gameTimeTicksAtom
} from "./actor"
import { GameLoopAction } from "./game"
import { WalkToAction } from "./movement"
import { CancelAction } from "./player"

export const AttackTargetAction = defineAction<{
    target: string
}>("AttackTarget")

export const AttackTargetData = defineData<{
    target?: string
}>("AttackTarget", {})

export type AttackDefinition = {
    type: "swing" | "stab" | "chop"
    length: number
    activate: number
    power: number
}

const DEFAULT_ATTACK = {
    start: 0,
    speed: 1,
    activated: false,
    power: 1
}

export const AttackData = defineData<{
    attack?: AttackDefinition
    start: number
    speed: number
    activated: boolean
}>("Attack", DEFAULT_ATTACK)

type AttackSource = {
    source: string
    attack: AttackDefinition
    power: number
}

export const ReceiveHitAction = defineAction<AttackSource>("ReceiveHit")

export const DiscoverAttacksAction = defineAction<{
    attacks: AttackSource[]
}>("DiscoverAttacks")

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
            const targetActor = getAtom(actorFamily(target))
            if (targetActor.destroyed) {
                set(AttackData, DEFAULT_ATTACK)
                return
            }
            const time = getAtom(gameTimeTicksAtom)
            if (!current.attack) {
                const attacks: AttackSource[] = []
                dispatch(DiscoverAttacksAction, { attacks })
                const attack = attacks[0]
                    ? attacks[0].attack
                    : {
                          type: "swing",
                          length: 1,
                          activate: 0.8,
                          power: 1
                      }
                set(AttackData, {
                    attack,
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
                    dispatch(
                        ReceiveHitAction,
                        { source: id, attack: current.attack, power },
                        target
                    )
                } else {
                    // TODO: visually represent a miss
                    // bad misses based on high negative could make player vulnerable
                    // monster blocks could also trigger vuln, separately
                }
                set(AttackData, (data) => ({ ...data, activated: true }))
            } else if (time > current.start + current.attack.length / current.speed) {
                set(AttackData, DEFAULT_ATTACK)
            }
        }

        const attackOrMove = (target: string) => {
            const current = get(AttackData)
            if (current.attack) {
                attack(target)
            }
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
            set(AttackData, DEFAULT_ATTACK)
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
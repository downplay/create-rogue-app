import { Vector2 } from "three"
import { GameLoopAction, LocationData, SpeedModule, defineData, defineModule } from "./actor"
import { Position } from "./dungeon"
import { VECTOR2_UP, angleBetween } from "./trig"

type ActorMovement = {
    target?: Position // TODO: target should be a Partial<ActorLocation>
}

const MovementData = defineData<ActorMovement>("Movement", {})

export const MovementModule = defineModule<ActorMovement>(
    "Movement",
    // (atom, get) => {
    //     // TODO: What do we expose here? Maybe more derived data than just the base data?
    //     // Local atom is here so we don't necessarily have to derive from it if we don't
    //     // want to recompute on every one of our own changes.
    //     // Maybe we should export the list of handled events.
    // },
    ({}, { handle, data, get }) => {
        const movement = data(MovementData)
        const location = data(LocationData)
        // Handle events here
        handle(GameLoopAction, (update) => {
            if (movement.value.target) {
                const speed = get(SpeedModule)
                const vector = new Vector2(
                    movement.value.target.x - location.value.position.x,
                    movement.value.target.y - location.value.position.y
                )
                const distance = vector.length()
                const step = speed * update.delta
                const direction = -angleBetween(VECTOR2_UP, vector) / Math.PI / 2
                // console.log(vector, VECTOR2_UP.angleTo(vector), direction)
                // Complete movement when close enough
                if (distance < step) {
                    const target = movement.value.target
                    location.set((l) => ({
                        ...l,
                        position: target,
                        direction
                    }))
                    movement.set({ target: undefined })
                    return
                }

                vector
                    .normalize()
                    .multiplyScalar(speed * update.delta)
                    .add(new Vector2(location.value.position.x, location.value.position.y))
                location.set((l) => ({
                    ...l,
                    position: { x: vector.x, y: vector.y },
                    direction
                }))
            }
        })
    }
)

export const WanderingModule = defineModule(
    "Wandering",
    () => undefined,
    ({}, { handle, rng, get, data }) => {
        // handle(MovementCompleteAction, () => {
        //     // TODO: In an ideal world we want to wait for a random amount of time then
        //     // pick a random spot within the current room to move to. This would be
        //     // made easier with herotext integration. We also want to not do anything
        //     // if there's a higher priority action e.g. attacking the player.
        //     // Maybe movement module should actually have a queue of movements/pauses
        //     // which can simply be cleared as soon as a player target is detected.
        //     // Question: What might actors need to do other than immediately target the
        //     // player? (And of course, *which* player if they have multiple toons in the room...)
        //     // Actors should only target the player inside a visibility/hearing range depending
        //     // on their properties vs player's stealth.
        //     // Monster actors:
        //     //  - More intelligent ones might inspect scenery
        //     //  - Steal items from ground
        //     //  - Move around a set path or pattern
        //     //  - Converse with other monsters
        //     //  - Sleep
        //     //  - Insects moving from flower to flower
        //     // Non-monsters:
        //     //  - Moving on a set path e.g. traps, platforms
        // })
        // For a simpler variation we'll just move with a low probability every tick.
        handle(GameLoopAction, ({ delta }) => {
            const movement = data(MovementData)
            if (!movement.value.target) {
                if (rng.next() < delta) {
                    // TOOD: Actually check size of room
                    movement.set({ target: { x: rng.float(1, 9), y: rng.float(1, 9) } })
                }
            }
        })
    }
)

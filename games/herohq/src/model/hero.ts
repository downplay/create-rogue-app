import { Atom, PrimitiveAtom, SetStateAction, atom } from "jotai"
import { atomFamily, atomWithStorage, splitAtom } from "jotai/utils"
import { Position } from "./dungeon"
import { Euler, Vector2 } from "three"

export type Vital = {
    hp: number
    fraction: number
    maximum: number
}

export type Hero = {
    id: string
    name: string
    class: string
    status: string
    level: number
}

// export const heroesMapAtom = atom((get) => {
//     const atoms = get(heroesAtomsAtom)
//     return atoms.reduce((acc, cur) => {
//         const hero = get(cur)
//         acc[hero.id] = cur
//         return acc
//     }, {} as Record<string, PrimitiveAtom<Hero>>)
// })

// Should never appear. We just need it to satisfy the signature of atomWithStorage as we
// are cheating a little to initialize the hero.
const UNINITIALIZED_HERO: Hero = {
    id: "UNIN",
    name: "Unin",
    level: 0,
    status: "Initializing",
    class: "Buggy"
}

export const heroFamily = atomFamily(
    (id: string | Hero) =>
        typeof id === "string"
            ? atomWithStorage<Hero>("Hero:" + id, UNINITIALIZED_HERO)
            : atomWithStorage<Hero>("Hero:" + id.id, id),
    (a, b) => (typeof a === "string" ? a : a.id) === (typeof b === "string" ? b : b.id)
)

// type HeroTarget = {}

// const heroTargetFamily = atomFamily((id: string) => {
//     return atomWithStorage<HeroTarget>("Hero:" + id, {})
// })

// atom(
//     (get) => {
//         const hero = get(heroesMapAtom)[id]
//         return get(hero)
//     },
//     (get, set, update: SetStateAction<Hero>) => {
//         const hero = get(heroesMapAtom)[id]
//         set(hero, update)
//     }
// )
// )

const heroCurrentHealthFamily = atomFamily((id: string) => atomWithStorage("health:" + id, 1))

const heroMaxHealthFamily = atomFamily((id: string) =>
    atom((get) => {
        const hero = get(heroFamily(id))
        // TODO: Hero will have a series of upgrades which may affect health as well as
        // body stat, equips and temporary effects
        return 10 + hero.level * 2
    })
)

export const heroHealthFamily = atomFamily<string, Atom<Vital>>((id: string) => {
    return atom((get) => {
        const maximum = get(heroMaxHealthFamily(id))
        const fraction = get(heroCurrentHealthFamily(id))
        return {
            hp: Math.round(fraction * maximum),
            fraction,
            maximum
        }
    })
})

export const heroVitalsFamily = atomFamily((id: string) => {
    return atom((get) => ({
        health: get(heroHealthFamily(id))
    }))
})

/**
 * Speed in cells/sec
 */
export const actorSpeedFamily = atomFamily((id: string) => {
    return atom((get) => {
        // const actor =
        // Calculate with small modifiers for level, agility, athletics, plus any potion effects.
        return 2.5
    })
})

// type ActorJob = {

// }

// export const heroJobFamily =  atomFamily((id: string) => atomWithStorage()

type ActorMovement = {
    target?: Position
}

export const actorMovementFamily = atomFamily((id: string) => {
    return atomWithStorage<ActorMovement>(id + ":Movement", {})
})

export type ActorLocation = {
    location: string
    room?: string
    position: Position
    direction: number
    // TODO: Also a target for their head so we can make it look at something else
    // but this should be determined a different way
}

const DEFAULT_ACTOR_LOCATION = {
    location: "Dungeon:1",
    position: { x: 5, y: 5 },
    direction: 0
}

// TODO: Maybe we should even split position into its own atom since it gets updated frequently
// but things that will change from room don't need to be updated so frequently
export const actorLocationFamily = atomFamily((id: string) => {
    return atomWithStorage<ActorLocation>(id + ":Location", DEFAULT_ACTOR_LOCATION)
})

type SetLoopAction = {
    type: "tick"
    time: number
    delta: number
}

const VECTOR2_UP = new Vector2(0, -1)

// TODO: Absolutely sure there should be a built-in method for this but I cannot find it!
// TODO: Move to a utility module
// https://gamedev.stackexchange.com/questions/200393/calculate-the-angle-of-rotation-between-two-vectors-relative-to-the-first-vector
const angleBetween = (a: Vector2, b: Vector2) => {
    // Get a vector rotated 90 degrees from a.
    const perpendicular = new Vector2(a.y, -a.x)

    // Compute a scaled projection of b onto the original and rotated version.
    const x = a.dot(b)
    const y = perpendicular.dot(b)

    // Treat these as a point in a coordinate system where a is the x axis,
    // and perpendicular is the y axis, and get the polar angle of that point.
    return Math.atan2(y, x)
}

export const heroLoopFamily = atomFamily((id: string) => {
    return atom(
        (get) => null,
        (get, set, update: SetLoopAction) => {
            // TODO: This feels like a lot of work to do every loop (and we'll be doing the same
            // for all entities 60 times per second)
            // Maybe we need to colocate all the data and avoid so many get calls. Or at least
            // all the disparate atoms as the family operations and string concats are possibly more expensive
            // than the gets.
            const actorId = "Hero:" + id
            const movement = get(actorMovementFamily(actorId))
            if (movement.target) {
                const location = get(actorLocationFamily(actorId))
                const speed = get(actorSpeedFamily(actorId))
                const vector = new Vector2(
                    movement.target.x - location.position.x,
                    movement.target.y - location.position.y
                )
                const distance = vector.length()
                const step = speed * update.delta
                const direction = -angleBetween(VECTOR2_UP, vector) / Math.PI / 2
                // console.log(vector, VECTOR2_UP.angleTo(vector), direction)
                // Complete movement when close enough
                if (distance < step) {
                    const target = movement.target
                    set(actorLocationFamily(actorId), (l) => ({
                        ...l,
                        position: target,
                        direction
                    }))
                    set(actorMovementFamily(actorId), { target: undefined })
                    return
                }

                vector
                    .normalize()
                    .multiplyScalar(speed * update.delta)
                    .add(new Vector2(location.position.x, location.position.y))
                set(actorLocationFamily(actorId), (l) => ({
                    ...l,
                    position: { x: vector.x, y: vector.y },
                    direction
                }))
            }
        }
    )
})

// vitals: {
//     health: Vital
//     magic: Vital
//     // Do we want stamina or any other system?
// }

export const activeHeroIdAtom = atomWithStorage<string | undefined>("activeHeroId", undefined)

export const activeHeroAtom = atom((get) => {
    const id = get(activeHeroIdAtom)
    if (id) {
        return get(heroFamily(id))
    }
    return undefined
})

type HeroControlCommand = {
    type: "WalkTo"
    target: Position
}

export const heroControlAtom = atom(
    (get) => {
        return get(activeHeroAtom)
    },
    (get, set, update: HeroControlCommand) => {
        const hero = get(activeHeroAtom)
        if (!hero) {
            return
        }
        switch (update.type) {
            case "WalkTo":
                set(actorMovementFamily("Hero:" + hero.id), { target: update.target })
                break
        }
    }
)

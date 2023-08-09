import { Atom, atom } from "jotai"
import { atomFamily, atomWithStorage } from "jotai/utils"
import { Position } from "./dungeon"

// export type Hero = Actor & {
//     name: string
//     class: string
// }

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
// const UNINITIALIZED_HERO: Hero = {
//     id: "UNIN",
//     name: "Unin",
//     level: 0,
//     status: "Initializing",
//     class: "Buggy"
// }

export const heroFamily = atomFamily(
    (id: string | Hero) =>
        typeof id === "string"
            ? atomWithStorage<Hero>("Hero:" + id, UNINITIALIZED_HERO)
            : atomWithStorage<Hero>("Hero:" + id.id, id),
    (a, b) => (typeof a === "string" ? a : a.id) === (typeof b === "string" ? b : b.id)
)

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
                // TODO: We should dispatch a TargetMoveTo action or similar instead
                // of setting the data ourselves (and hide the data more)
                set(actorDataFamily(hero.id, MovementData), { target: update.target })
                break
        }
    }
)

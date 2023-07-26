import { Atom, PrimitiveAtom, SetStateAction, atom } from "jotai"
import { atomFamily, atomWithStorage, splitAtom } from "jotai/utils"

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

// vitals: {
//     health: Vital
//     magic: Vital
//     // Do we want stamina or any other system?
// }

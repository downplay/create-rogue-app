import { Atom, PrimitiveAtom, SetStateAction, atom } from "jotai"
import { atomFamily, atomWithStorage, splitAtom } from "jotai/utils"

export type Vital = {
    current: number
    maximum: number
}

export type Hero = {
    id: string
    name: string
    class: string
    status: string
    level: number
}

export const heroesAtom = atomWithStorage<Hero[]>("roster", [])
export const heroesAtomsAtom = splitAtom(heroesAtom)
export const heroesMapAtom = atom((get) => {
    const atoms = get(heroesAtomsAtom)
    return atoms.reduce((acc, cur) => {
        const hero = get(cur)
        acc[hero.id] = cur
        return acc
    }, {} as Record<string, PrimitiveAtom<Hero>>)
})
export const heroFamily = atomFamily((id: string) =>
    atom(
        (get) => {
            const hero = get(heroesMapAtom)[id]
            return get(hero)
        },
        (get, set, update: SetStateAction<Hero>) => {
            const hero = get(heroesMapAtom)[id]
            set(hero, update)
        }
    )
)

const heroCurrentHealthFamily = atomFamily((id: string) => atomWithStorage("health:" + id, 0))

const heroMaxHealthFamily = atomFamily((id: string) =>
    atom((get) => {
        const hero = get(heroFamily(id))
        // TODO: Hero will have a series of upgrades which may affect health as well as
        // body stat, equips and temporary effects
        return 10 + hero.level * 2
    })
)

export const heroHealthFamily = atomFamily<string, Atom<Vital>>((id: string) => {
    return atom((get) => ({
        current: get(heroCurrentHealthFamily(id)),
        maximum: get(heroMaxHealthFamily(id))
    }))
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

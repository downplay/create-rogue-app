import { atom } from "jotai"
import { atomFamily, atomWithStorage } from "jotai/utils"
import {
    RenderModule,
    SpeedModule,
    actorFamily,
    defineAction,
    defineActor,
    defineData,
    defineModule
} from "./actor"
import { HumanRender } from "../dungeon/characters/HumanRender"
import { MovementModule, WalkToAction } from "./movement"
import { CancelAction, PLAYER_ID } from "./player"
import { Position } from "./spacial"
import { FightModule } from "./fight"
import { HealthModule } from "./health"

export type Vital = {
    amount: number
    fraction: number
    maximum: number
}

export const NameData = defineData("Name", "Anon")
export const ClassData = defineData("Class", "Npc")
const OwnerData = defineData<string | undefined>("Owner", undefined)

export const RecruitHeroAction = defineAction("RecruitHero")

export const HeroModule = defineModule(
    "Hero",
    (_, { get }) => {
        const owner = get(OwnerData)
        return {
            name: get(NameData),
            class: get(ClassData),
            owner,
            // TODO: Expand status to check current activity
            status: owner ? "Employed" : "Seeking work"
        }
    },
    (_, { set, handle }) => {
        handle(RecruitHeroAction, () => {
            set(OwnerData, PLAYER_ID)
        })
    }
)

export const HeroActor = defineActor("Hero", [
    [RenderModule, { renderer: HumanRender }],
    HealthModule,
    SpeedModule,
    MovementModule,
    HeroModule,
    FightModule
])

export const heroVitalsFamily = atomFamily((id: string) => {
    return atom((get) => ({
        health: get(HealthModule.family(id))
    }))
})

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

// export const heroFamily = atomFamily(
//     (id: string | Hero) =>
//         typeof id === "string"
//             ? atomWithStorage<Hero>("Hero:" + id, UNINITIALIZED_HERO)
//             : atomWithStorage<Hero>("Hero:" + id.id, id),
//     (a, b) => (typeof a === "string" ? a : a.id) === (typeof b === "string" ? b : b.id)
// )

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
        return get(actorFamily(id))
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
                set(actorFamily(hero.id), {
                    type: "action",
                    action: CancelAction,
                    payload: {}
                })
                set(actorFamily(hero.id), {
                    type: "action",
                    action: WalkToAction,
                    payload: { target: update.target }
                })
                break
        }
    }
)

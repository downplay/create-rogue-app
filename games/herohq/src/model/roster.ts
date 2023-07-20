import { Atom, atom } from "jotai"
import { atomFamily, atomWithStorage } from "jotai/utils"
import { Hero, heroFamily, heroesAtomsAtom } from "./hero"
import { bunkRoomAtom } from "./hq"

export const rosterSizeAtom = atom((get) => {
    const bunkRoom = get(bunkRoomAtom)
    return bunkRoom.beds.length
})

export const activeHeroIdAtom = atomWithStorage<string | undefined>("activeHeroId", undefined)

export const activeHeroAtom = atom((get) => {
    const id = get(activeHeroIdAtom)
    if (id) {
        return get(heroFamily(id))
    }
    return undefined
})

const heroIsActiveFamily = atomFamily((heroAtom: Atom<Hero>) => {
    return atom((get) => {
        const activeId = get(activeHeroIdAtom)
        const hero = get(heroAtom)
        return hero.id === activeId
    })
})

type RosterSlot = { index: number } & (
    | {
          type: "hero"
          hero: Atom<Hero>
          active: Atom<boolean>
      }
    | {
          type: "empty"
      }
    | {
          type: "upgrade"
          locked: boolean
      }
)

export const rosterAtom = atom<RosterSlot[]>((get) => {
    const heroAtoms = get(heroesAtomsAtom)
    const slots: RosterSlot[] = heroAtoms.map((hero, i) => ({
        index: i,
        type: "hero",
        hero,
        active: heroIsActiveFamily(hero)
    }))
    const size = get(rosterSizeAtom)
    const freeSlots = size - heroAtoms.length
    if (freeSlots > 0) {
        for (let n = 0; n < freeSlots; n++) {
            slots.push({
                index: heroAtoms.length + n + 1,
                type: "empty"
            })
        }
    }
    slots.push({
        index: size + 1,
        type: "upgrade",
        // TODO: Check if an upgrade is available
        locked: true
    })
    return slots
})

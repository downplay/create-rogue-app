import { Atom, PrimitiveAtom, atom, SetStateAction } from "jotai"
import { atomFamily, atomWithStorage } from "jotai/utils"
import { Hero, activeHeroIdAtom, heroFamily } from "./hero"
import { bunkRoomAtom } from "./hq"
import { isFunction } from "remeda"

export const rosterSizeAtom = atom((get) => {
    const bunkRoom = get(bunkRoomAtom)
    return bunkRoom.beds.length
})

export const rosterHeroesAtom = atomWithStorage<string[]>("Roster", [])
export const rosterHeroesAtomsAtom = atom((get) => get(rosterHeroesAtom).map(heroFamily))

const heroIsActiveFamily = atomFamily((heroAtom: Atom<Hero>) => {
    return atom(
        (get) => {
            const activeId = get(activeHeroIdAtom)
            const hero = get(heroAtom)
            return hero.id === activeId
        },
        (get, set, value: SetStateAction<boolean>) => {
            const hero = get(heroAtom)
            const current = get(activeHeroIdAtom) === hero.id
            if (isFunction(value) ? value(current) : value) {
                set(activeHeroIdAtom, hero.id)
            } else if (current) {
                set(activeHeroIdAtom, undefined)
            }
        }
    )
})

type RosterSlot = { index: number } & (
    | {
          type: "hero"
          hero: PrimitiveAtom<Hero>
          active: PrimitiveAtom<boolean>
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
    const heroAtoms = get(rosterHeroesAtomsAtom)
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

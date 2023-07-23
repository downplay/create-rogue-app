// TODO: For now we have a single pool of recruits from an unnamed source. We need to add
// choice of where to recruit from (or maybe as you unlock new recruitment places it will just add to the pool?)

import { Atom, atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import seedrandom from "seedrandom"
import { Random } from "random"
import { Hero, heroFamily } from "./hero"
import { Cost } from "./account"
import { rosterHeroesAtom } from "./roster"

export const recruitsSeedAtom = atomWithStorage("Recruits:Seed", "flibble")
export const recruitsSeedTimeAtom = atomWithStorage("Recruits:SeedTimeAtom", 0)

export const recruitModalVisibleAtom = atom(false)

const NAMES = ["Bob", "Ted", "Fred", "Mike", "Lilly", "Amy", "Jane", "Mary"]

const CLASSES = ["Fighter", "Wizard", "Ranger"]

export type Interviewee = {
    cost: Cost
    hero: Atom<Hero>
}

export const recruitsAtom = atom((get) => {
    const seed = get(recruitsSeedAtom)
    const rng = new Random(seedrandom(seed))
    const distribution = rng.logNormal(0.5, 0.5)
    const interviewees: Interviewee[] = []
    console.log("RESEEDING", seed)
    // TODO: Perfect use case for herotext
    // TODO: Number of interviewees should depend on our fame and other unlocks
    for (let n = 0; n < 3; n++) {
        // TODO: Play with mu and sigma in the distribution to get the nicest curve. Also we should
        // ensure at least 1 recruit that is within a low limit at least early on so the player
        // can afford it, maybe we should cap max level as well. (Unlockable later).
        const weight = distribution()
        console.log("Weight", weight)
        const id = "Hero:" + seed + ":" + n
        const hero: Hero = {
            id,
            level: Math.max(1, Math.floor(Math.log(weight) * 2)),
            class: rng.choice(CLASSES)!,
            name: rng.choice(NAMES)!,
            status: "Seeking Job"
        }
        interviewees.push({
            cost: Math.ceil(weight * 10),
            // Note: Here's the kicker. I can't issue a set to go and update the storage
            // on this hero. Instead I'm abusing the way family equality works, hero family
            // can take either a string or Hero and we can use the eq function. So long
            // as this is definitely the first atom that ever accesses the family for this
            // id everything will be ok (and as far as I can see it should be!)
            hero: heroFamily(hero)
        })
    }
    console.log(seed, interviewees)
    return interviewees
})

export const availableRecruitsAtom = atom((get) => {
    const recruits = get(recruitsAtom)
    const roster = get(rosterHeroesAtom)
    // TODO: Performance wise this kind of thing is a trap. We'll be recomputing this any time anything
    // about any hero changes. But all we actually care is if ids are added. Also it's now implied that dead
    // heroes should stay in the roster (maybe bed can be de-assigned tho). Otherwise if a hero
    // died quick enough they would show back up in recruitment list.
    return recruits.filter((r) => !roster.find((id) => id === get(r.hero).id))
})

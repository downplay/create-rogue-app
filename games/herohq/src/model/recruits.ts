// TODO: For now we have a single pool of recruits from an unnamed source. We need to add
// choice of where to recruit from (or maybe as you unlock new recruitment places it will just add to the pool?)

/* A dump of some tags, perks etc which could be applied to recruits and adjust the value.

Accident Prone - starts at 1/2 HP. higher chance for critical misses.

*/

import { Getter, Setter, atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Cost } from "./account"
import { rosterHeroesAtom } from "./roster"
import { makeRng } from "./rng"
import { ActorAtom, actorFamily } from "./actor"
import { ClassData, HeroActor, NameData } from "./hero"
import { LevelData } from "./level"

export const recruitsSeedAtom = atomWithStorage("Recruits:Seed", "flibble")
export const recruitsSeedTimeAtom = atomWithStorage("Recruits:SeedTimeAtom", 0)

export const recruitModalVisibleAtom = atom(false)

const NAMES = ["Bob", "Ted", "Fred", "Mike", "Lilly", "Amy", "Jane", "Mary"]

const CLASSES = ["Fighter", "Wizard", "Ranger"]

export type Interviewee = {
    id: string
    weight: number
    cost: Cost
    hero: ActorAtom
    name: string
    class: string
}

export const recruitsAtom = atom((get) => {
    const seed = get(recruitsSeedAtom)
    const rng = makeRng(seed)
    const distribution = rng.logNormal(0.5, 0.5)
    const interviewees: Interviewee[] = []
    // TODO: Perfect use case for herotext
    // TODO: Number of interviewees should depend on our fame and other unlocks. We should do this inside a
    // "Recruiter" actor hooked into the game tick really.
    for (let n = 0; n < 3; n++) {
        // TODO: Play with mu and sigma in the distribution to get the nicest curve. Also we should
        // ensure at least 1 recruit that is within a low limit at least early on so the player
        // can afford it, maybe we should cap max level as well. (Unlockable later).
        const id = "Hero:" + seed + ":" + n
        const weight = distribution()
        interviewees.push({
            id,
            weight,
            cost: Math.ceil(weight * 10),
            // Note: Here's the kicker. I can't issue a set() to go and update the storage
            // on this hero. Instead I'm abusing the way family equality works, hero family
            // can take either a string or Hero and we can use the eq function. So long
            // as this is definitely the first atom that ever accesses the family for this
            // id everything will be ok (and as far as I can see it should be!)
            // Well now I found the one problem with this, the storage is never saved if
            // the atom is never updated. So when we recruit we just have to issue one
            // save on the hero and they get stored. (Fine anyway, and we'll never need them
            // again).
            hero: actorFamily(id),
            name: rng.choice(NAMES)!,
            class: rng.choice(CLASSES)!
        })
    }
    return interviewees
})

export const regenerateRecruits = (get: Getter, set: Setter) => {
    const interviewees = get(recruitsAtom)
    for (const i of interviewees) {
        set(i.hero, {
            type: "initialize",
            actor: HeroActor,
            data: [
                [LevelData, Math.max(1, Math.floor(Math.log(i.weight) * 2))],
                [NameData, i.name],
                [ClassData, i.class]
            ]
        })
    }
}

export const availableRecruitsAtom = atom((get) => {
    const recruits = get(recruitsAtom)
    const roster = get(rosterHeroesAtom)
    // TODO: Performance wise this kind of thing is a trap. We'll be recomputing this any time anything
    // about any hero changes. But all we actually care is if ids are added. Also it's now implied that dead
    // heroes should stay in the roster (maybe bed can be de-assigned tho). Otherwise if a hero
    // died quick enough they would show back up in recruitment list.
    return recruits.filter((r) => !roster.find((id) => id === get(r.hero).id))
})

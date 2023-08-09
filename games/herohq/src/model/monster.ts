/* Just a mega list of some monsters to include

* Bugs:
  - Firebug/icebug
  - Killabug/Megabug/Gigabug/Terrorbug/Petabug/etc
  - Dadabug/Momabug
  - Jumpbug
* Manypede
* Golems/Automatons, all kinds of elements
* Dustbin
* Statue head
* Snowpeople
* Mimics
* ROUS
* Gargoyles
* Gremlins
* Carnivorous plants. Creepers. Trees.
* Baby dragons

* Crawlers. Mutated humanoid forms crawling on the ground. Eventually discover some are intelligent and they have
  a secret underground civilisation with their own questline.

* Mutants

Bosses!

* https://en.wikipedia.org/wiki/Quinotaur
  Some sort of deep dungeon water level boss.
* Capricorn goat + mermaid
* Baba yaga in a swamp somewhere
* Big Dragons of course
* Gronk

*/

import { atomWithStorage } from "jotai/utils"
import { ComponentType } from "react"
import { actorDataFamily } from "./actor"

export type MonsterProps = {
    id: string
}

type MonsterParams = {
    renderer: ComponentType<MonsterProps>
}

export type MonsterDefinition = {
    type: string
} & MonsterParams

export const monstersAtom = atomWithStorage<string[]>("monsters", [])

type MonsterData = {
    level: number
    // speed: number
}

export const monsterDataFamily = (id: string) => actorDataFamily<MonsterData>("Data", { level: 1 })

import { atomWithStorage } from "jotai/utils"
import { mapIds, mapSequence } from "./util"
import { atom } from "jotai"
import { Cost } from "./account"

// const RoomsData = [
//     {
//         id: "bunks",
//         title: "Crew Bunks",
//         upgrades: [

//         ]
//     }
// ]

type UpgradeEffect = {
    type: "add"
    item: string
    amount: number
}

type UpgradeRequirement = {
    type: "level"
    value: number
}

type Upgrade = {
    id: string
    title: string
    level: number
    cost: Cost
    effects: UpgradeEffect[]
    requires: UpgradeRequirement[]
}

const BUNKROOM_UPGRADES = mapSequence<Upgrade>(1, 100, (level) => ({
    id: "BunkRoom:" + level,
    title: "Level " + level,
    level,
    cost: level === 1 ? 0 : 1 + 2 ** (level - 1),
    effects: [{ type: "add", item: "bed", amount: 1 }],
    requires: [{ type: "level", value: level - 1 }]
}))

const UPGRADE_MAP = mapIds(BUNKROOM_UPGRADES)

const BED_UPGRADES = [
    {
        id: "straw",
        title: "Straw Bed"
    },
    {
        id: "straw",
        title: "Straw Bed"
    },
    {
        id: "wool",
        title: "Wool Mattress"
    }
]

const HqBunksRoom = () => {}

const hqAtom = atomWithStorage("hq", {
    rooms: []
})

type AppliedUpgrade = {
    id: string
}

const bunkRoomUpgrades = atomWithStorage<AppliedUpgrade[]>("BunkRoom:Upgrades", [
    { id: "BunkRoom:1" },
    { id: "BunkRoom:2" },
    { id: "BunkRoom:3" },
    { id: "BunkRoom:4" },
    { id: "BunkRoom:5" }
])

export const bunkRoomAtom = atom((get) => {
    const upgrades = get(bunkRoomUpgrades)
    // TODO: Beds will need to be atoms in their own right and have their own
    // upgrades etc. to determine capacity and bonuses, and also track who is sleeping in them
    // TODO: I don't know if this pattern is great all the time as we may end up building the whole
    // beds list every time unrelated things change.
    const beds = []
    let level = 0
    for (const u of upgrades) {
        const upgrade = UPGRADE_MAP[u.id]
        if (!upgrade) {
            throw new Error("Unknown upgrade: " + u.id)
        }
        if (upgrade.level > level) {
            level = upgrade.level
        }
        for (const e of upgrade.effects) {
            switch (e.type) {
                case "add": {
                    switch (e.item) {
                        case "bed": {
                            // TODO: Check any other perks giving us extra space.
                            // e.g. "Tetris Expert" Allows you to always pack in a little bit extra (10% extra bunks and storage)
                            // Must be a permanent perk however it is acquired as we can't go deleting beds.
                            for (let n = 0; n < e.amount; n++) {
                                beds.push({
                                    id: beds.length + 1
                                })
                            }
                            break
                        }
                        default:
                            throw new Error("Unknown bunkroom resource " + e.item)
                    }
                }
            }
        }
    }
    return { level, beds }
})

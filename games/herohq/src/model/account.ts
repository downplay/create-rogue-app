import { atom } from "jotai"

export type Account = {
    name: string
    company: string
}

// Different types of cost.
// coin: Standard currency of the realm, used for exchange in shops, found on monster corpses everywhere
// and received as payment for jobs.
// fame: The public's perception fo your agency and your heroes. Received by completing great deeds: defeating
// new monsters, defeating extra diffcult monsters, reaching new depths of the dungeon, new locations.
// skill: What you might call "experience" in another game, this is received continously through play as
// your heroes learn. It can be spent on hero levels and abilities.
// boon: Spiritual currency received from god as favour for observing their rituals.
// lore: Currency of knowledge, received for new discoveries, can be spent on things like research,
// exploration, discovery.
export type CostResource = {
    type: "coin" | "fame" | "lore" | "boon" | "skill"
    amount: number
}
// | {
//     type: "item"
//     conditions: ItemCondition[]
// }

export type Cost = number | CostResource[]

export const accountAtom = {
    name: "Joe Bloggs",
    company: "Dungeoning Ltd"
}

export const treasuryAtom = atom({
    coin: 0,
    fame: 0,
    lore: 0,
    boon: 0
})

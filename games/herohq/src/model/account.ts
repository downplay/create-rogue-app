export type Account = {
    name: string
    company: string
    balance: {
        coin: number
        fame: number
        lore: number
        boon: number
    }
}

export type CostResource = {
    type: "coin" | "fame" | "lore" | "boon"
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

import { RenderModule, defineActor } from "../../model/actor"
import { ItemModule } from "../../model/item"
import { CoinRender } from "./CoinRender"

// const CoinInventory = defineInventory("Coin")

// TODO: Is coin really just another type of inventory? Seems to work kinda...
export const CoinItem = defineActor("Coin", [
    [RenderModule, { renderer: CoinRender }],
    [ItemModule, { stackable: true, currency: "coin" }]
])

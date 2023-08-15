import { defineData, defineModule } from "./actor"
import { InteractionAction } from "./player"

type ItemModuleOpts = {
    stackable: boolean
    currency: string
    valuePer: number
}

export const ItemData = defineData<{ amount: number }>("Item", { amount: 1 })

export const ItemModule = defineModule(
    "Item",
    ({ currency, valuePer }: ItemModuleOpts, { get }) => {
        const { amount } = get(ItemData)
        return {
            amount,
            currency,
            valuePer,
            value: valuePer * amount
        }
    },
    (opts: ItemModuleOpts, { handle }) => {
        handle(InteractionAction, () => {
            // Walk to and pick up
        })
    }
)

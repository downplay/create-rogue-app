import { atomFamily } from "jotai/utils"
import { Rod } from "../../3d/Parts"
import { ActorProps, useModule } from "../../model/actor"
import { atom, useAtomValue } from "jotai"
import { ItemModule } from "../../model/item"
import { COIN_TIERS, denominate } from "../../model/coin"
import { makeMetalMaterial } from "../../3d/materials"
import { useMemo } from "react"

const coinMaterialFamily = atomFamily((tier: number) => {
    return atom(() => {
        const colorHex = (COIN_TIERS[tier] || COIN_TIERS[0]).color
        return makeMetalMaterial(colorHex)
    })
})

export const CoinRender = ({ id }: ActorProps) => {
    // Get amount
    const item = useModule(ItemModule, id)
    // Denominate
    const tier = useMemo(() => denominate(item.amount)[0].tier, [item])
    // Make a metallic material
    const material = useAtomValue(coinMaterialFamily(tier))

    // TODO: Give it physics. Spawn it with some velocity and flipping over.
    return <Rod length={0.01} caps={0.05} material={material} />
}

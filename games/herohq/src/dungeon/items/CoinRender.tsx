import { atomFamily } from "jotai/utils"
import { Rod } from "../../3d/Parts"
import { ActorProps, useModule } from "../../model/actor"
import { atom, useAtomValue } from "jotai"
import { ItemModule } from "../../model/item"
import { COIN_TIERS, denominate } from "../../model/coin"
import { makeMetalMaterial } from "../../3d/materials"
import { useMemo } from "react"
import { WithToss } from "../../3d/physics/wrappers"

const coinMaterialFamily = atomFamily((tier: number) => {
    return atom(() => {
        const colorHex = (COIN_TIERS[tier] || COIN_TIERS[0]).color
        return makeMetalMaterial(colorHex)
    })
})

const COIN_THICKNESS = 0.05 // 0.01
const COIN_RADIUS = 0.2 // 0.1

export const CoinRender = ({ id, mode }: ActorProps) => {
    // Get amount
    const item = useModule(ItemModule, id)
    // Denominate
    const tier = useMemo(() => denominate(item.amount)[0].tier, [item])
    // Make a metallic material
    const material = useAtomValue(coinMaterialFamily(tier))

    // TODO: We need to have a
    // PhysicsModule which will wrap this for us and we *don't* want to render
    // the physics when rendering a static item for the inventory display.
    // We need a kind of pipeline situation which allows us to enhance the
    // renderer modularly.
    // For now the mode switch is OK
    return mode === "game" ? (
        <WithToss position={[0, 0.5, 0]}>
            <Rod length={COIN_THICKNESS} caps={COIN_RADIUS} material={material} />
        </WithToss>
    ) : (
        <Rod length={COIN_THICKNESS} caps={COIN_RADIUS} material={material} />
    )
}

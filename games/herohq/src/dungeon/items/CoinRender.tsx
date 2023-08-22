import { atomFamily } from "jotai/utils"
import { Rod } from "../../3d/Parts"
import { ActorProps, useModule } from "../../model/actor"
import { atom, useAtomValue } from "jotai"
import { ItemModule } from "../../model/item"
import { COIN_TIERS, denominate } from "../../model/coin"
import { makeMetalMaterial } from "../../3d/materials"
import { useMemo } from "react"
import { rngAtom } from "../../model/rng"
import { RigidBody, Vector3Tuple } from "@react-three/rapier"

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

    // TODO: We'll repeat this pattern a bunch of times and should
    // be wrapped inside an <Item> renderer component. We need to have a
    // PhysicsModule which will wrap this for us and we *don't* want to render
    // the physics when rendering a static item for the inventory display.
    // We need a kind of pipeline situation which allows us to enhance the
    // renderer modularly.
    const rng = useAtomValue(rngAtom)
    const [angular, linear] = useMemo(() => {
        return [
            [rng.next() * 50 - 25, rng.next() * 10 - 5, rng.next() * 50 - 25],
            [rng.next() - 0.5, rng.next() * 2 + 1, rng.next() - 0.5]
        ] as [Vector3Tuple, Vector3Tuple]
    }, [])
    return (
        <RigidBody position={[0, 0.5, 0]} linearVelocity={linear} angularVelocity={angular}>
            <Rod length={0.01} caps={0.1} material={material} />
        </RigidBody>
    )
}

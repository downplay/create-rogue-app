import { ContainerModule, InventoryData } from "../model/item"
import { useModule, ActorAtom, RenderModule, undefinedAtom } from "../model/actor"
import styled from "@emotion/styled"
import { useAtomValue } from "jotai"
import { Canvas } from "@react-three/fiber"
import { activeHeroIdAtom } from "../model/hero"

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const FIXED_CAMERA = {
    fov: 45,
    near: 1,
    far: 1000,
    position: [0, 0, 100] as const
}

const FixedActor = ({ id, isSelected = false }: { id: string; isSelected?: boolean }) => {
    const Renderer = useModule(RenderModule, id)
    return <Renderer id={id} selected={isSelected} />
}

const Item = styled.div`
    border: solid 2px black;
    width: 128;
    height: 128;
`

const ContainerItem = ({ atom }: { atom: ActorAtom }) => {
    const actor = useAtomValue(atom)
    return (
        <Item>
            <Canvas camera={FIXED_CAMERA} frameloop="always">
                <FixedActor id={actor.id} />
            </Canvas>
        </Item>
    )
}

export const Container = ({ id }: { id: string }) => {
    const items = useModule(ContainerModule, id)
    return (
        <Grid>
            {items.map((item) => (
                <ContainerItem key={item.toString()} atom={item} />
            ))}
        </Grid>
    )
}

export const Inventory = () => {
    // ({ id }: { id: string }) => {
    const hero = useAtomValue(activeHeroIdAtom)
    const inv = useAtomValue(hero ? InventoryData.family(hero) : undefinedAtom)
    return inv?.container ? <Container id={inv.container} /> : null
}

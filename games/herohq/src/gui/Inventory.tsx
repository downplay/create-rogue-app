import { ContainerModule, InventoryData, ItemModule } from "../model/item"
import { useModule, ActorAtom, RenderModule, undefinedAtom } from "../model/actor"
import styled from "@emotion/styled"
import { useAtomValue } from "jotai"
import { Canvas } from "@react-three/fiber"
import { activeHeroIdAtom } from "../model/hero"
import { Euler } from "three"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { PropsWithChildren } from "react"

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const FIXED_CAMERA = {
    fov: 45,
    near: 0.1,
    far: 100,
    position: [0, 0, 2] as const
}

const FixedActorRotate = new Euler(Math.PI / 4, 0, 0)

const FixedActor = ({ id, isSelected = false }: { id: string; isSelected?: boolean }) => {
    const Renderer = useModule(RenderModule, id)
    return (
        <group rotation={FixedActorRotate}>
            <Renderer id={id} selected={isSelected} mode="thumbnail" />
        </group>
    )
}

const Item = styled.div`
    position: relative;
    width: 128px;
    height: 128px;
`

const Target = styled(Item)`
    border: solid 2px black;
`

const Value = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
`

export const ItemThumbnail = ({ atom }: { atom: ActorAtom }) => {
    const actor = useAtomValue(atom)
    const inv = useModule(ItemModule, actor.id)
    const { setNodeRef, listeners, attributes } = useDraggable({ id: actor.id })
    return (
        <Item title={actor.type} ref={setNodeRef}>
            <Canvas camera={FIXED_CAMERA} frameloop="demand" {...listeners} {...attributes}>
                <ambientLight intensity={0.1} />
                <pointLight position={[-10, 10, 20]} />
                <FixedActor id={actor.id} />
            </Canvas>
            {inv.stackable ? <Value>{inv.amount}</Value> : null}
        </Item>
    )
}

const ContainerTarget = ({
    id,
    index,
    children
}: PropsWithChildren<{ id: string; index: number }>) => {
    const { setNodeRef } = useDroppable({ id, data: { type: "Container", index } })

    return <Target ref={setNodeRef}>{children}</Target>
}

export const Container = ({ id, className }: { id: string; className?: string }) => {
    const items = useModule(ContainerModule, id)
    return (
        <Grid className={className}>
            {items.map((item, i) => (
                <ContainerTarget key={id + ":" + i} id={id} index={i}>
                    <ItemThumbnail key={item.toString()} atom={item} />
                </ContainerTarget>
            ))}
        </Grid>
    )
}

export const Inventory = ({ className }: { className?: string }) => {
    // ({ id }: { id: string }) => {
    const hero = useAtomValue(activeHeroIdAtom)
    const inv = useAtomValue(hero ? InventoryData.family(hero) : undefinedAtom)
    return inv?.container ? <Container id={inv.container} className={className} /> : null
}

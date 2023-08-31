import { useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { RenderModule, actorFamily, undefinedAtom, useModule } from "../model/actor"
import styled from "@emotion/styled"
import { PropsWithChildren } from "react"
import { useDroppable } from "@dnd-kit/core"
import { IconFeet, IconLeftHand, IconRightHand } from "./icons"
import { ItemThumbnail } from "./Inventory"
import { EquipModule } from "../model/equip"

const Grid = styled.div`
    display: grid;
    grid-template-areas: ". head ." "left body right" ". feet .";
`

const Border = styled.div<{ name: string }>`
    border: solid 2px black;
    grid-area: ${({ name }) => name};
`

// TODO: Maybe we need to pass the selected prop down?
const EquipActor = ({
    id /* , isSelected = false */
}: {
    id: string /*; isSelected?: boolean*/
}) => {
    const Renderer = useModule(RenderModule, id)
    return (
        // <group rotation={FixedActorRotate}>
        <Renderer id={id} mode="equip" />
        // </group>
    )
}

export const EquipHandle = ({ id, name }: { id: string; name: string }) => {
    const equip = useModule(EquipModule, id)
    const item = equip.slots[name]
    // const itemAtom = useAtomValue(item ? )
    return item ? <EquipActor id={item} /> : null
}

const EquipSlot = ({
    name,
    children,
    ...rest
}: PropsWithChildren<{ name: string; title: string }>) => {
    const { setNodeRef } = useDroppable({
        id: name,
        data: {
            type: "Equip",
            name
        }
        // TODO: Figure out how to highlight valid targets
        // data: {
        //     accepts: ["type1", "type2"]
        // }
    })
    const heroId = useAtomValue(activeHeroIdAtom)
    const current = useModule(EquipModule, heroId || "")
    const currentEquip = current?.slots[name]

    return (
        <Border name={name} ref={setNodeRef} {...rest}>
            {children}
            {currentEquip ? <ItemThumbnail atom={actorFamily(currentEquip)} /> : null}
        </Border>
    )
}

const EquipGrid = () => {
    return (
        <Grid>
            <EquipSlot name="head" title="Head">
                Head
            </EquipSlot>
            <EquipSlot name="left" title="Left hand">
                <IconLeftHand />
            </EquipSlot>
            <EquipSlot name="right" title="Right hand">
                <IconRightHand />
            </EquipSlot>
            <EquipSlot name="body" title="Body">
                Body
            </EquipSlot>
            <EquipSlot name="feet" title="Feet">
                <IconFeet />
            </EquipSlot>
        </Grid>
    )
}

export const Equip = () => {
    const hero = useAtomValue(activeHeroIdAtom)
    const equip = useAtomValue(hero ? EquipModule.family(hero) : undefinedAtom)
    return equip ? <EquipGrid slots={equip.slots} /> : null
}

import { useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { RenderModule, actorFamily, undefinedAtom, useModule } from "../model/actor"
import styled from "@emotion/styled"
import { PropsWithChildren } from "react"
import { useDroppable } from "@dnd-kit/core"
import { IconArmor, IconFeet, IconHelmet, IconLeftHand, IconRightHand } from "./icons"
import { ItemThumbnail } from "./Inventory"
import { EquipModule } from "../model/equip"

const Grid = styled.div`
    display: grid;
    grid-template-areas: ". head ." "left body right" ". feet .";
`

const Border = styled.div<{ name: string }>`
    border: solid 2px black;
    grid-area: ${({ name }) => name};
    font-size: 48px;
    text-align: center;
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
    actorId,
    name,
    children,
    ...rest
}: PropsWithChildren<{ actorId: string; name: string; title: string }>) => {
    const { setNodeRef } = useDroppable({
        id: actorId + ":" + name,
        data: {
            id: actorId,
            type: "Equip",
            name
        }
        // TODO: Figure out how to highlight valid targets
        // data: {
        //     accepts: ["type1", "type2"]
        // }
    })
    const current = useModule(EquipModule, actorId)
    const currentEquip = current?.slots[name]

    return (
        <Border name={name} ref={setNodeRef} {...rest}>
            {children}
            {currentEquip ? <ItemThumbnail atom={actorFamily(currentEquip)} /> : null}
        </Border>
    )
}

const EquipGrid = ({ actorId }: { actorId: string }) => {
    // TODO: We should actually check EquipModule and map over what slots are there
    return (
        <Grid>
            <EquipSlot actorId={actorId} name="head" title="Head">
                <IconHelmet />
            </EquipSlot>
            <EquipSlot actorId={actorId} name="left" title="Left hand">
                <IconLeftHand />
            </EquipSlot>
            <EquipSlot actorId={actorId} name="right" title="Right hand">
                <IconRightHand />
            </EquipSlot>
            <EquipSlot actorId={actorId} name="body" title="Body">
                <IconArmor />
            </EquipSlot>
            <EquipSlot actorId={actorId} name="feet" title="Feet">
                <IconFeet />
            </EquipSlot>
        </Grid>
    )
}

export const Equip = () => {
    const hero = useAtomValue(activeHeroIdAtom)
    const equip = useAtomValue(hero ? EquipModule.family(hero) : undefinedAtom)
    return hero && equip ? <EquipGrid actorId={hero} slots={equip.slots} /> : null
}

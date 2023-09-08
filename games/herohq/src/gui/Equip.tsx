import { useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { RenderModule, actorFamily, undefinedAtom, useModule } from "../model/actor"
import styled from "@emotion/styled"
import { PropsWithChildren, RefObject } from "react"
import { useDroppable } from "@dnd-kit/core"
import { IconArmor, IconFeet, IconHelmet, IconLeftHand, IconRightHand } from "./icons"
import { ItemThumbnail } from "./Inventory"
import { EquipModule, EquipmentModule } from "../model/equip"
import { Vector3 } from "three"
import { RapierRigidBody } from "@react-three/rapier"

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
    id /* , isSelected = false */,
    handleRef
}: {
    id: string /*; isSelected?: boolean*/
    handleRef: RefObject<RapierRigidBody>
}) => {
    const Renderer = useModule(RenderModule, id)
    const equip = useModule(EquipmentModule, id)
    const EquipmentRenderer = equip.renderer
    return (
        // <group rotation={FixedActorRotate}>
        EquipmentRenderer ? (
            <EquipmentRenderer id={id} mode="equip" handleRef={handleRef} />
        ) : (
            <Renderer id={id} mode="equip" />
        )
        // </group>
    )
}

// export const EquipHandle = ({ id, name }: { id: string; name: string }) => {
//     // TODO: We'll need more, actually need normal as well
//     const positionRef = useRef<Vector3>(null)
//     // TODO: Will this even work? Should maybe have a handler rather
//     useEffect(() => {

//     }, [positionRef.current])
//     return <PositionRef ref={positionRef} />
// }

export const EquipHandle = ({
    id,
    name,
    positionRef,
    handleRef
}: {
    id: string
    name: string
    positionRef: RefObject<Vector3>
    handleRef: RefObject<RapierRigidBody>
}) => {
    const equip = useModule(EquipModule, id)
    const item = equip.slots[name]
    // const itemAtom = useAtomValue(item ? )
    // const groupRef = useRef<Group>(null)
    // useFrame(() => {
    //     if (groupRef.current && positionRef.current) {
    //         groupRef.current.position.set(
    //             positionRef.current.x,
    //             positionRef.current.y,
    //             positionRef.current.z
    //         )
    //     }
    // })

    return item ? (
        // <group ref={groupRef}>
        <EquipActor id={item} handleRef={handleRef} />
    ) : // </group>
    null
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

import { useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { undefinedAtom } from "../model/actor"
import styled from "@emotion/styled"
import { PropsWithChildren } from "react"
import { useDroppable } from "@dnd-kit/core"
import { EquipModule } from "../model/item"
import { IconFeet, IconLeftHand, IconRightHand } from "./icons"

const Grid = styled.div`
    display: grid;
    grid-template-areas: ". head ." "left body right" ". feet .";
`

const Border = styled.div<{ name: string }>`
    border: solid 2px black;
    grid-area: ${({ name }) => name};
`

const Slot = ({ name, children, ...rest }: PropsWithChildren<{ name: string; title: string }>) => {
    const { setNodeRef } = useDroppable({
        id: name
        // TODO: Figure out how to highlight valid targets
        // data: {
        //     accepts: ["type1", "type2"]
        // }
    })
    return (
        <Border name={name} ref={setNodeRef} {...rest}>
            {children}
        </Border>
    )
}

const EquipGrid = () => {
    return (
        <Grid>
            <Slot name="head" title="Head">
                Head
            </Slot>
            <Slot name="left" title="Left hand">
                <IconLeftHand />
            </Slot>
            <Slot name="right" title="Right hand">
                <IconRightHand />
            </Slot>
            <Slot name="body" title="Body">
                Body
            </Slot>
            <Slot name="feet" title="Feet">
                <IconFeet />
            </Slot>
        </Grid>
    )
}

export const Equip = () => {
    const hero = useAtomValue(activeHeroIdAtom)
    const equip = useAtomValue(hero ? EquipModule.family(hero) : undefinedAtom)
    return equip ? <EquipGrid slots={equip.slots} /> : null
}

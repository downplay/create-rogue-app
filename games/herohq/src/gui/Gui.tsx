import { atomWithStorage } from "jotai/utils"
import styled from "@emotion/styled"
import { useAtom, useSetAtom } from "jotai"
import { Roster } from "./Roster"
import { Modals } from "./Modals"
import { useCallback, useMemo, useState } from "react"
import { City } from "./City"
import { Dungeon } from "./Dungeon"
import { HQ, HQRoomId } from "./HQ"
import { Toolbar } from "./Toolbar"
import Rodal from "rodal"
import { Inventory, ItemThumbnail } from "./Inventory"
import { Equip } from "./Equip"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import { actorFamily } from "../model/actor"
import { dispatchDropAtom } from "../model/item"

type GuiState =
    | {
          mode: "town"
      }
    | {
          mode: "hq"
          room?: HQRoomId
      }
    | {
          mode: "building"
          buildingId: string
      }
    | {
          mode: "dungeon"
          seed: string
          floor: number
      }

export const guiStateAtom = atomWithStorage<GuiState>("Gui", {
    mode: "dungeon",
    seed: "test",
    floor: 1
})

type GuiPopup = {
    name?: "inventory" | "equipment" | "stats"
}

export const guiPopupAtom = atomWithStorage<GuiPopup>("GuiPopup", {})

const Grid = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template: "main roster" "main equip" "main inv";
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto auto 1fr;
`
const Cell = styled.div<{ name: string }>`
    position: relative;
    grid-area: ${({ name }) => name};
    overflow: auto;
`

const SideInventory = styled(Inventory)`
    display: grid;
    grid-template-columns: 1fr 1fr;
`

export const Gui = () => {
    const [state, setState] = useAtom(guiStateAtom)
    const [popup, setPopup] = useAtom(guiPopupAtom)

    const dispatchDrop = useSetAtom(dispatchDropAtom)

    const main = useMemo(() => {
        switch (state.mode) {
            case "hq":
                return <HQ />
            case "town":
                return <City />
            case "dungeon":
                return <Dungeon location={"Dungeon:" + state.floor} />
        }
    }, [state])

    const popupElement = useMemo(() => {
        if (!popup.name) {
            return null
        }
        switch (popup.name) {
            case "inventory":
                return <Inventory />
        }
    }, [popup.name])

    const handlePopupClose = useCallback(() => {
        setPopup({})
    }, [setPopup])

    const [activeId, setActiveId] = useState<string | null>(null)

    const handleDragStart = (e: DragStartEvent) => {
        // TODO: Probably inspect the data
        setActiveId(e.active.id.toString())
    }

    const handleDragEnd = (e: DragEndEvent) => {
        if (e.over) {
            dispatchDrop({ source: e.active.data, target: e.over.id, data: e.over.data })
        }
        setActiveId(null)
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Grid>
                <Cell name="main">
                    {main}
                    <Toolbar></Toolbar>
                </Cell>
                <Cell name="roster">
                    <Roster />
                </Cell>
                <Cell name="equip">
                    <Equip />
                </Cell>
                <Cell name="inv">
                    <SideInventory />
                </Cell>
            </Grid>
            <DragOverlay>
                {activeId ? <ItemThumbnail atom={actorFamily(activeId)} /> : null}
            </DragOverlay>
            <Rodal
                visible={!!popup.name}
                onClose={handlePopupClose}
                customStyles={{ width: "80%", height: "80%" }}>
                {popupElement}
            </Rodal>
            <Modals />
        </DndContext>
    )
}

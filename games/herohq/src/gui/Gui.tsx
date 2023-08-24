import { atomWithStorage } from "jotai/utils"
import styled from "@emotion/styled"
import { useAtom } from "jotai"
import { Roster } from "./Roster"
import { useGameLoop } from "../model/game"
import { Modals } from "./Modals"
import { useCallback, useMemo } from "react"
import { City } from "./City"
import { Dungeon } from "./Dungeon"
import { HQ, HQRoomId } from "./HQ"
import { Toolbar } from "./Toolbar"
import Rodal from "rodal"
import { Inventory } from "./Inventory"

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
    grid-template: "main roster";
    grid-template-columns: 1fr 200px;
    grid-template-rows: 1fr;
`
const Cell = styled.div<{ name: string }>`
    position: relative;
    grid-area: ${({ name }) => name};
`

export const Gui = () => {
    const [state, setState] = useAtom(guiStateAtom)
    const [popup, setPopup] = useAtom(guiPopupAtom)
    useGameLoop()
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

    return (
        <>
            <Grid>
                <Cell name="main">
                    {main}
                    <Toolbar></Toolbar>
                </Cell>
                <Cell name="roster">
                    <Roster />
                </Cell>
            </Grid>
            <Rodal
                visible={!!popup.name}
                onClose={handlePopupClose}
                customStyles={{ width: "80%", height: "80%" }}>
                {popupElement}
            </Rodal>
            <Modals />
        </>
    )
}

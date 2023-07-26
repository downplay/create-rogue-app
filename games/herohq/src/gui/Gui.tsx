import { atomWithStorage } from "jotai/utils"
import styled from "@emotion/styled"
import { useAtom } from "jotai"
import { Roster } from "./Roster"
import { useGameLoop } from "../model/game"
import { Modals } from "./Modals"
import { useMemo } from "react"
import { City } from "./City"
import { Dungeon } from "./Dungeon"

type GuiState =
    | {
          mode: "city"
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

export const guiStateAtom = atomWithStorage<GuiState>("gui", {
    mode: "dungeon",
    seed: "test",
    floor: 1
})

const Grid = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template: "main roster";
    grid-template-columns: 1fr 200px;
    grid-template-rows: 1fr;
`
const Cell = styled.div<{ name: string }>`
    grid-area: ${({ name }) => name};
`

export const Gui = () => {
    const [state, setState] = useAtom(guiStateAtom)
    useGameLoop()
    const main = useMemo(() => {
        switch (state.mode) {
            case "city":
                return <City />
            case "dungeon":
                return <Dungeon />
        }
    }, [state])
    return (
        <>
            <Grid>
                <Cell name="main">{main}</Cell>
                <Cell name="roster">
                    <Roster />
                </Cell>
            </Grid>
            <Modals />
        </>
    )
}

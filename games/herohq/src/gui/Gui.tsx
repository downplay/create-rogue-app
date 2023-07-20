import { atomWithStorage } from "jotai/utils"
import styled from "@emotion/styled"
import { useAtom } from "jotai"
import { Roster } from "./Roster"

type GuiState =
    | {
          mode: "city"
      }
    | {
          mode: "building"
          buildingId: string
      }

export const guiStateAtom = atomWithStorage<GuiState>("gui", { mode: "city" })

const Grid = styled.div`
    display: grid;
    grid-template: "main roster";
    grid-template-rows: 1fr;
`
const Cell = styled.div<{ name: string }>`
    grid-area: ${({ name }) => name};
`

export const Gui = () => {
    const [state, setState] = useAtom(guiStateAtom)

    return (
        <Grid>
            <Cell name="roster">
                <Roster />
            </Cell>
        </Grid>
    )
}

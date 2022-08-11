import styled from "styled-components"
import { Window } from "./Window"
import { CHAR_WIDTH, CHAR_HEIGHT } from "./Typography"

const Screen = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #000;
    display: grid;
    grid-template-columns: auto ${CHAR_WIDTH * 8}px;
    grid-template-rows: auto ${CHAR_HEIGHT * 8}px;
`

export const Layout = () => {
    // const { player, content, map, game } = engine;
    return (
        <Screen>
            {/* <Map map={map} player={player.globalScope} /> */}
            {/* <Status player={player.globalScope} game={game.globalScope} /> */}
            <Window name="board" />
            <Window name="status" />
            {/* <Window name="inventory" /> */}
            <Window name="terminal" />
        </Screen>
    )
}

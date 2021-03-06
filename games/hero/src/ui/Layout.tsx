import React from "react";
import styled from "styled-components";
import { Window } from "./Window";
import { Map } from "../game/dungeon/Map";
import { Terminal } from "./Terminal";
import { CHAR_WIDTH, CHAR_HEIGHT } from "./Typography";
import { Status } from "./Status";

const Screen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: grid;
  grid-template-columns: auto ${CHAR_WIDTH * 8}px;
  grid-template-rows: auto ${CHAR_HEIGHT * 8}px;
`;

type AProps = {
  player: PlayerState;
  terminal: TerminalContent;
  map: GridState;
};

export const Layout = ({ game, player, terminal, map }: AProps) => {
  return (
    <Screen>
      <Window>
        <Map map={map} player={player} />
      </Window>
      <Window>
        <Status player={player} game={game} />
      </Window>
      <Window>
        <Terminal terminal={terminal} game={game} />
      </Window>
    </Screen>
  );
};

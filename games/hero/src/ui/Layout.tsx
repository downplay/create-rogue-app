import React from "react";
import styled from "styled-components";
import { Window } from "./Window";
import { Terminal, TerminalContent } from "./Terminal";
import { CHAR_WIDTH, CHAR_HEIGHT } from "./Typography";
import { Status } from "./Status";
import { GameState } from "../engine/game";
import { Grid } from "../engine/grid";
import { PlayerState } from "../game/Player";
import { Map } from "../map/Map";

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
  content: TerminalContent;
  map: Grid;
  game: GameState;
};

export const Layout = ({ engine, player, content, map }: AProps) => {
  return (
    <Screen>
      <Window>
        <Map map={map} player={player} />
      </Window>
      <Window>
        <Status player={player} game={game} />
      </Window>
      <Window>
        <Terminal content={content} engine={engine} />
      </Window>
    </Screen>
  );
};

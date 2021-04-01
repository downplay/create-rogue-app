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
import { HeroEngine } from "../engine/types";

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
  engine: HeroEngine;
};

export const Layout = ({ engine }: AProps) => {
  const { player, content, map, game } = engine;
  return (
    <Screen>
      <Window>
        <Map map={map} player={player.globalScope} />
      </Window>
      <Window>
        <Status player={player.globalScope} game={game.globalScope} />
      </Window>
      <Window>
        <Terminal content={content} engine={engine} />
      </Window>
    </Screen>
  );
};

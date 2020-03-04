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
  background-color: 000;
  display: grid;
  grid-template-columns: auto ${CHAR_WIDTH * 12}px;
  grid-template-rows: auto ${CHAR_HEIGHT * 8}px;
`;

export const Layout = () => {
  return (
    <Screen>
      <Window>
        <Map />
      </Window>
      <Window>
        <Status />
      </Window>
      <Window>
        <Terminal />
      </Window>
    </Screen>
  );
};

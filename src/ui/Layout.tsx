import React from "react";
import styled from "styled-components";
import { Window } from "./Window";
import { Map } from "../game/dungeon/Map";
import { Terminal } from "./Terminal";

const Screen = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: 000;
  display: grid;
`;

export const Layout = () => {
  return (
    <Screen>
      <Window>
        <Map />
      </Window>
      <Window>
        <Terminal />
      </Window>
      <Window>Status</Window>
    </Screen>
  );
};

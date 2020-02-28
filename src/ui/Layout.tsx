import React from "react";
import styled from "styled-components";

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
      <MapWindow>
        <Map></Map>
      </MapWindow>
      <ConsoleWindow>
        <Console></Console>
      </ConsoleWindow>
      <StatusWindow></StatusWindow>
    </Screen>
  );
};

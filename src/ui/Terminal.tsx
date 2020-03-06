import React from "react";
import { Line } from "./Typography";
import { useTerminalState } from "../engine/terminal";
import styled from "styled-components";

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const Terminal = () => {
  const terminal = useTerminalState();
  return (
    <Scroller>
      {terminal.messages.map((text, index) => (
        <Line key={index}>{text}</Line>
      ))}
    </Scroller>
  );
};

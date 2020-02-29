import React from "react";
import { Line } from "./Typography";
import { useTerminal } from "../engine/terminal";

export const Terminal = () => {
  const terminal = useTerminal();
  return (
    <>
      {terminal.messages.map((text, index) => (
        <Line key={index}>{text}</Line>
      ))}
    </>
  );
};

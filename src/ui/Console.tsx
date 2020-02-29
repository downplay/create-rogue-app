import { useConsole } from "../engine/RogueContext";
import React from "react";
import { Line } from "./Typography";

export const Console = () => {
  const console = useConsole();
  return (
    <>
      {console.messages.map((text, index) => (
        <Line key={index}>{text}</Line>
      ))}
    </>
  );
};

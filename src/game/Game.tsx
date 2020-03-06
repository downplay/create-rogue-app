import React, { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { Test } from "./levels/Test";
// import { usePlayer } from "../engine/RogueContext";

export const Game = () => {
  const terminal = useTerminal();
  // const player = usePlayer();
  useEffect(() => {
    terminal.write("Create Rogue App v0.0.1");
  }, []);
  return <Test />;
};

import React, { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { TestLint } from "./levels/TestLint";
import { TavernEncounter } from "./scenes/TavernEncounter";

export const Game = () => {
  const terminal = useTerminal();
  useEffect(() => {
    terminal.write(`> create rogue ~@pp v${process.env.REACT_APP_VERSION}`);
  }, []);
  return (
    <>
      <TavernEncounter />
      <TestLint />
    </>
  );
};

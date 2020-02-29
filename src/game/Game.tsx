import React, { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { Test } from "./levels/Test";

export const Game = () => {
  const terminal = useTerminal();
  useEffect(() => {
    terminal.write("Create Rogue App v0.0.1");
  }, []);
  return <Test />;
};

import React, { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { Test } from "./levels/Test";

export const Game = () => {
  const terminal = useTerminal();
  useEffect(() => {
    terminal.write(`> create rogue ~@pp v${process.env.REACT_APP_VERSION}`);
  }, []);
  return <Test />;
};

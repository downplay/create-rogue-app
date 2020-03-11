import React, { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { ClassicRooms } from "./levels/ClassicRooms";

export const Game = () => {
  const terminal = useTerminal();
  useEffect(() => {
    terminal.write(`> create rogue ~@pp v${process.env.REACT_APP_VERSION}`);
  }, []);
  return <ClassicRooms />;
};

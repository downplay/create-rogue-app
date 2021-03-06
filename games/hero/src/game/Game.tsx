import { text } from "herotext";
import { useEffect } from "react";
import { useTerminal } from "../engine/terminal";
import { TavernEncounter } from "./scenes/tavern/TavernEncounter";

const gameStory = text`
> create rogue ~@pp v${process.env.REACT_APP_VERSION}

$goto(RoomEncounter)
`;

export const Game = () => {
  const terminal = useTerminal();
  useEffect(() => {
    terminal.write(`> create rogue ~@pp v${process.env.REACT_APP_VERSION}`);
  }, []);
  return (
    <>
      <TavernEncounter />
    </>
  );
};

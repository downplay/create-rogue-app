import React, { createContext } from "react";
import { GameState } from "./types";

export const initializeState = (): GameState => ({});
export const GameContext = createContext<GameState>(initializeState());

export const EntityContext = createContext<GameState["entities"]>(null);

type Props = {
  state: GameState;
  children: React.ReactChildren;
};

export const RogueProvider = ({ state, children }: Props) => {
  return (
    <GameContext.Provider value={state}>
      <EntityContext.Provider value={state.grid}>
        <GridContext.Provider value={state.grid}>
          <ConsoleContext.Provider value={state.console}>
            {children}
          </ConsoleContext.Provider>
        </GridContext.Provider>
      </EntityContext.Provider>
    </GameContext.Provider>
  );
};

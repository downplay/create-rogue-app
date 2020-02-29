import React, { useReducer, useState } from "react";
import {
  GameState,
  PlayerState,
  GridState,
  ConsoleState,
  BaseGameState
} from "../game/types";
import { Vector, vector } from "./vector";
import { useMemo } from "react";
import { blankGrid } from "./grid";
import { EntitiesProvider } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";

export const initialState = (): BaseGameState => {
  const grid = { map: blankGrid(100, 100) };

  const player = {
    stats: stats(10,5,5,5,5,5),
    position: vector(0, 0)
  };

  const entities = { state: {} };

  const console = {
    messages: []
  };

  return { grid, entities, player, console };
};

export const [useGame, GameProvider] = createContext<GameState>();
export const [usePlayer, PlayerProvider] = createContext<PlayerState>();
export const [useGrid, GridProvider] = createContext<GridState>();
export const [useConsole, ConsoleProvider] = createContext<ConsoleState>();

type Props = {
  initialState: BaseGameState;
  children: React.ReactChildren;
};

const actions = {
  entities: entitiesActions,
  player: playerActions,
  grid  : gridActions,
  console: consoleActions,
}

const SetStateType = {state: React.Dispatch<BaseGameState>}
const bindActionSlice = (setState, value) => {

}

const bindActions =( setState:  ) => {
   return Object.entries(actions).reduce((acc,[key,value]) => {
    acc[key] = bindActionSlice(setState, value)
   },{})
}

export const RogueProvider = ({ initialState, children }: Props) => {
  const [state, setState] = useState(initialState)


  const contextState = useMemo(()=>{
    return {
      entities: {
        ...state.entities,

      }
    }

  },[state])

  const grid = useMemo(
    () => ({
      cells: state,
      addTile: (position: Vector, Component: React.ComponentType) => {}
    }),
    []
  );

  return (
    <GameProvider value={state}>
      <PlayerProvider value={state.player}>
        <EntitiesProvider value={state.entities}>
          <GridProvider value={state.grid}>
            <ConsoleProvider value={state.console}>{children}</ConsoleProvider>
          </GridProvider>
        </EntitiesProvider>
      </PlayerProvider>
    </GameProvider>
  );
};

import React, { useMemo, useState } from "react";
import {
  GameState,
  PlayerState,
  GridState,
  ConsoleState,
  BaseGameState
} from "../game/types";
import { Vector, vector } from "./vector";
import { produce } from "immer";
import { blankGrid } from "./grid";
import { EntitiesProvider } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
export const initialState = (): BaseGameState => {
  const grid = { map: blankGrid(100, 100) };

  const player = {
    stats: stats(10, 5, 5, 5, 5, 5),
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
  grid: gridActions,
  console: consoleActions
};

type SetStateType = {
  state: React.Dispatch<React.SetStateAction<BaseGameState>>;
};
const bindActionSlice = (
  setState: SetStateType,
  slice: Record<string, (state: BaseGameState) => BaseGameState>
) => {
  return Object.entries(slice).reduce((acc, [key, value]) => {
    acc[key] = (state: BaseGameState) =>
      produce(state, state => value(state[key]));
    return acc;
  }, {});
};

const bindActions = (setState: SetStateType) => {
  return Object.entries(actions).reduce((acc, [key, value]) => {
    acc[key] = bindActionSlice(setState, value);
    return acc;
  }, {});
};

export const RogueProvider = ({ initialState, children }: Props) => {
  const [state, setState] = useState(initialState);

  const boundActions = useMemo(() => bindActions(setState), [setState]);

  const contextState = useMemo(() => {
    const next = { ...state };
    Object.keys(next).forEach(key => {
      next[key] = { ...next[key], ...boundActions[key] };
    });
    return next;
  }, [state, boundActions]);

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

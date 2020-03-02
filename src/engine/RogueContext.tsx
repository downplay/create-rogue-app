import React, { useMemo, useState } from "react";
import {
  GameContext,
  PlayerContext,
  GameState,
  GameActions
} from "../game/types";

import { vector } from "./vector";
import { produce } from "immer";
import { blankGrid, gridActions, GridProvider } from "./grid";
import { EntitiesProvider } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import { stats } from "./hasStats";
import { entitiesActions } from "./useEntitiesState";
import { playerActions } from "./player";
import { terminalActions, TerminalProvider } from "./terminal";
import { useRef } from "react";

export const initializeState = (): GameState => {
  const grid = { map: blankGrid(100, 100) };

  const player = {
    stats: stats(10, 5, 5, 5, 10),
    position: vector(0, 0)
  };

  const entities = { state: {} };

  const terminal = {
    messages: []
  };

  return { grid, entities, player, terminal };
};

export const [useGame, GameProvider] = createContext<GameContext>();
export const [usePlayer, PlayerProvider] = createContext<PlayerContext>();

const actions = {
  entities: entitiesActions,
  player: playerActions,
  grid: gridActions,
  terminal: terminalActions
};

type SetStateType = React.Dispatch<React.SetStateAction<GameState>>;

type ActionProducer = (...args: any) => (state: any) => any;

type ActionKeys = keyof GameState;

const bindActionSlice = (
  setState: SetStateType,
  slice: Record<string, ActionProducer>
) => {
  return Object.entries(slice).reduce<Record<string, (state: any) => any>>(
    (acc, [key, value]) => {
      acc[key] = (...args: any[]) => {
        setState(state =>
          produce(state, state => {
            state[key as ActionKeys] = value(...args)(state[key as ActionKeys]);
            return state;
          })
        );
      };
      return acc;
    },
    {}
  );
};

const bindActions = (setState: SetStateType): GameActions => {
  return Object.entries(actions).reduce<Record<ActionKeys, any>>(
    (acc, [key, value]) => {
      acc[key as ActionKeys] = bindActionSlice(setState, value);
      return acc;
    },
    {} as Record<ActionKeys, any>
  );
};

type Props = React.PropsWithChildren<{
  initialState: GameState;
}>;

export const RogueProvider = ({ initialState, children }: Props) => {
  const [state, setState] = useState(initialState);

  const boundActions = useMemo(() => bindActions(setState), [setState]);

  const contextRef = useRef<GameContext>();
  const context = useMemo<GameContext>(() => {
    const next = Object.keys(state).reduce<Record<ActionKeys, any>>(
      (acc, key) => {
        acc[key as ActionKeys] =
          contextRef.current?.[key as ActionKeys] === state[key as ActionKeys]
            ? state[key as ActionKeys]
            : {
                ...state[key as ActionKeys],
                ...boundActions[key as ActionKeys]
              };
        return acc;
      },
      {} as Record<ActionKeys, any>
    );
    return next as GameContext;
  }, [state, boundActions]);
  contextRef.current = context;

  return (
    <GameProvider value={context}>
      <PlayerProvider value={context.player}>
        <EntitiesProvider value={context.entities}>
          <GridProvider value={context.grid}>
            <TerminalProvider value={context.terminal}>
              {children}
            </TerminalProvider>
          </GridProvider>
        </EntitiesProvider>
      </PlayerProvider>
    </GameProvider>
  );
};

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
import { ControlsProvider } from "./controls";

export const initializeState = (): GameState => {
  const grid = { map: blankGrid(40, 40) };

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

type ContextKeys = keyof GameState;

const bindActionSlice = (
  contextKey: ContextKeys,
  contextRef: React.MutableRefObject<GameContext>,
  setState: SetStateType,
  slice: Record<string, ActionProducer>
) => {
  return Object.entries(slice).reduce<Record<string, (state: any) => any>>(
    (acc, [key, value]) => {
      acc[key] = (...args: any[]) => {
        let result: any;
        const state = produce(contextRef.current, state => {
          result = value(...args)(state[contextKey]);
          return state;
        });
        setState(state);
        contextRef.current = state;
        return result;
      };
      return acc;
    },
    {}
  );
};

const bindActions = (
  contextRef: React.MutableRefObject<GameContext>,
  setState: SetStateType
): GameActions => {
  return Object.entries(actions).reduce<Record<ContextKeys, any>>(
    (acc, [key, value]) => {
      acc[key as ContextKeys] = bindActionSlice(
        key as ContextKeys,
        contextRef,
        setState,
        value
      );
      return acc;
    },
    {} as Record<ContextKeys, any>
  );
};

type Props = React.PropsWithChildren<{
  initialState: GameState;
}>;

export const RogueProvider = ({ initialState, children }: Props) => {
  const [state, setState] = useState(initialState);

  const contextRef = useRef<GameContext>(null!);
  const boundActions = useMemo(() => bindActions(contextRef, setState), [
    setState
  ]);

  const context = useMemo<GameContext>(() => {
    const next = Object.keys(state).reduce<Record<ContextKeys, any>>(
      (acc, key) => {
        acc[key as ContextKeys] =
          contextRef.current?.[key as ContextKeys] === state[key as ContextKeys]
            ? state[key as ContextKeys]
            : {
                ...state[key as ContextKeys],
                ...boundActions[key as ContextKeys]
              };
        return acc;
      },
      {} as Record<ContextKeys, any>
    );
    return next as GameContext;
  }, [state, boundActions]);
  contextRef.current = context;

  return (
    <GameProvider value={context}>
      <ControlsProvider>
        <PlayerProvider value={context.player}>
          <EntitiesProvider value={context.entities}>
            <GridProvider value={context.grid}>
              <TerminalProvider value={context.terminal}>
                {children}
              </TerminalProvider>
            </GridProvider>
          </EntitiesProvider>
        </PlayerProvider>
      </ControlsProvider>
    </GameProvider>
  );
};

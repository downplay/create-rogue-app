import React, { useMemo, useState } from "react";
import { GameContext, GameState, GameActions } from "../game/types";

import { vector } from "./vector";
import { produce } from "immer";
import {
  blankGrid,
  gridActions,
  GridProvider,
  GridStateProvider
} from "./grid";
import {
  EntitiesProvider,
  EntitiesStateProvider,
  entitiesActions
} from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import { stats } from "./hasStats";
import { playerActions } from "./player";
import {
  terminalActions,
  TerminalProvider,
  TerminalStateProvider
} from "./terminal";
import { useRef } from "react";
import { ControlsProvider } from "./controls";
import { PlayerState, PlayerActions } from "../game/types";

export const initializeState = (): GameState => {
  const grid = { map: blankGrid(32, 32) };

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
export const [usePlayer, PlayerProvider] = createContext<PlayerActions>();
export const [usePlayerState, PlayerStateProvider] = createContext<
  PlayerState
>();

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
  stateRef: React.MutableRefObject<GameState>,
  setState: SetStateType,
  slice: Record<string, ActionProducer>
) => {
  return Object.entries(slice).reduce<Record<string, (state: any) => any>>(
    (acc, [key, value]) => {
      acc[key] = (...args: any[]) => {
        let result: any;
        const state = produce(stateRef.current, state => {
          result = value(...args)(state[contextKey]);
          return state;
        });
        console.log("updating state: " + key);
        stateRef.current = state;
        setState(state);
        return result;
      };
      return acc;
    },
    {}
  );
};

const bindActions = (
  stateRef: React.MutableRefObject<GameState>,
  setState: SetStateType
): GameActions => {
  return Object.entries(actions).reduce<Record<ContextKeys, any>>(
    (acc, [key, value]) => {
      acc[key as ContextKeys] = bindActionSlice(
        key as ContextKeys,
        stateRef,
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
  const stateRef = useRef<GameState>(null!);

  const boundActions = useMemo(() => bindActions(stateRef, setState), [
    setState
  ]);

  const context = useMemo<GameContext>(() => {
    const next = Object.keys(state).reduce<Record<ContextKeys, any>>(
      (acc, key) => {
        acc[key as ContextKeys] =
          stateRef.current?.[key as ContextKeys] === state[key as ContextKeys]
            ? contextRef.current[key as ContextKeys]
            : {
                ...state[key as ContextKeys],
                ...boundActions[key as ContextKeys]
              };
        return acc;
      },
      {} as Record<ContextKeys, any>
    );
    stateRef.current = state;
    return next as GameContext;
  }, [state, boundActions]);

  contextRef.current = context;

  console.log(state);
  return (
    <GameProvider value={context}>
      <ControlsProvider>
        <PlayerProvider value={boundActions.player}>
          <PlayerStateProvider value={state.player}>
            <EntitiesProvider value={boundActions.entities}>
              <EntitiesStateProvider value={state.entities}>
                <GridProvider value={boundActions.grid}>
                  <GridStateProvider value={state.grid}>
                    <TerminalProvider value={boundActions.terminal}>
                      <TerminalStateProvider value={state.terminal}>
                        {children}
                      </TerminalStateProvider>
                    </TerminalProvider>
                  </GridStateProvider>
                </GridProvider>
              </EntitiesStateProvider>
            </EntitiesProvider>
          </PlayerStateProvider>
        </PlayerProvider>
      </ControlsProvider>
    </GameProvider>
  );
};

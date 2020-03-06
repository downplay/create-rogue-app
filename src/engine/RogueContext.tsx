import React, { useMemo, useState } from "react";
import { RogueContext, RogueState, RogueActions } from "../game/types";
import { produce } from "immer";

import {
  blankGrid,
  gridMutations,
  gridQueries,
  GridProvider,
  GridStateProvider
} from "./grid";
import {
  EntitiesProvider,
  EntitiesStateProvider,
  entitiesMutations,
  entitiesQueries
} from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import {
  terminalMutations,
  terminalQueries,
  TerminalProvider,
  TerminalStateProvider
} from "./terminal";
import { useRef } from "react";
import { ControlsProvider } from "./controls";
import { PlayerProvider } from "./player";
import { gameMutations, gameQueries } from "./game";

export const initializeState = (): RogueState => {
  const game = { time: 0 };

  const grid = { map: blankGrid(32, 32) };

  const entities = { state: {} };

  const terminal = {
    messages: []
  };

  return { game, grid, entities, terminal };
};

// export const [useRogue, RogueProvider] = createContext<RogueContext>();

const mutations = {
  game: gameMutations,
  entities: entitiesMutations,
  grid: gridMutations,
  terminal: terminalMutations
};

const queries = {
  game: gameQueries,
  entities: entitiesQueries,
  grid: gridQueries,
  terminal: terminalQueries
};

type SetStateType = React.Dispatch<React.SetStateAction<RogueState>>;

type ActionProducer = (...args: any) => (state: any) => any;

type ContextKeys = keyof RogueState;

const bindQuerySlice = (
  contextKey: ContextKeys,
  stateRef: React.MutableRefObject<RogueState>,
  slice: Record<string, ActionProducer>
) => {
  return Object.entries(slice).reduce<Record<string, (state: any) => any>>(
    (acc, [key, value]) => {
      acc[key] = (...args: any[]) => {
        return value(...args)(stateRef.current[contextKey]);
      };
      return acc;
    },
    {}
  );
};

const bindMutationSlice = (
  contextKey: ContextKeys,
  stateRef: React.MutableRefObject<RogueState>,
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
  stateRef: React.MutableRefObject<RogueState>,
  setState: SetStateType
): RogueActions => {
  return Object.entries(mutations).reduce<Record<ContextKeys, any>>(
    (acc, [key, value]) => {
      acc[key as ContextKeys] = {
        ...bindMutationSlice(key as ContextKeys, stateRef, setState, value),
        ...bindQuerySlice(
          key as ContextKeys,
          stateRef,
          queries[key as ContextKeys]
        )
      };

      return acc;
    },
    {} as Record<ContextKeys, any>
  );
};

type Props = React.PropsWithChildren<{
  initialState: RogueState;
}>;

export const RogueProvider = ({ initialState, children }: Props) => {
  const [state, setState] = useState(initialState);

  const contextRef = useRef<RogueContext>(null!);
  const stateRef = useRef<RogueState>(null!);

  const boundActions = useMemo(() => bindActions(stateRef, setState), [
    setState
  ]);

  const context = useMemo<RogueContext>(() => {
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
    return next as RogueContext;
  }, [state, boundActions]);

  contextRef.current = context;
  return (
    // <RogueProvider value={context}>
    <ControlsProvider>
      <PlayerProvider>
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
      </PlayerProvider>
    </ControlsProvider>
    // </RogueProvider>
  );
};

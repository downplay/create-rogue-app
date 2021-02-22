import React, { useState, useMemo, useCallback } from "react";
import { createContext } from "../helpers/createContext";
import { EntityContext } from "./useEntitiesState";

type PlayerState = {
  current: EntityContext;
};

export type PlayerContext = PlayerState & {
  register: (entity: EntityContext) => void;
};

export const playerActions = {
  register: (entity: EntityContext) => (player: PlayerState) => {
    player.current = entity;
  }
};

export const [usePlayer, Provider] = createContext<PlayerContext>();

export const PlayerProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, setState] = useState<PlayerState>({
    current: {}
  } as PlayerState);

  const register = useCallback(
    (entity: EntityContext) => {
      setState({ current: entity });
    },
    [setState]
  );

  const context = useMemo<PlayerContext>(() => {
    return {
      ...state,
      register
    };
  }, [state]);

  return <Provider value={context}>{children}</Provider>;
};

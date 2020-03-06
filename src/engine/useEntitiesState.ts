import { useRef, useMemo, useEffect, useCallback } from "react";
import { v4 } from "uuid";
import { EntitiesStateRecord } from "../game/types";
import { createContext } from "../helpers/createContext";
import { produce } from "immer";
import { EntitiesState, EntitiesActions, SetStateAction } from "../game/types";

export type EntityContext = {
  state: EntityStateRecord;
  get: <T>(key: string | symbol) => T;
  update: <T>(key: string | symbol, state: SetStateAction<T>) => void;
  getFlag: (key: string | symbol) => boolean;
  setFlag: (key: string | symbol, value?: boolean) => void;
};

export type EntityStateRecord = Record<string | symbol, any>;
export type EntityFlagsRecord = Record<string | symbol, boolean | undefined>;

export const entitiesMutations = {
  register: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    entities[id] = entityState;
    return entities;
  },
  // TODO: register and update are suspiciously the same, really need two of them?
  update: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    entities[id] = entityState;
    return entities;
  },
  unregister: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    delete entities[id];
    return entities;
  }
};

export const entitiesQueries = {};

export const useEntityContext = (): [EntityContext, string] => {
  const entities = useEntities();
  // Note: it looks unused but without this, the component won't update and therefore new state
  // also can't be passed to the children.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entitiesState = useEntitiesState();
  const id = useMemo(() => v4(), []);
  const stateRef = useRef<EntityStateRecord>({});
  const flagsRef = useRef<EntityFlagsRecord>({});
  const update = useCallback(
    <T>(key: string | symbol, nextState: SetStateAction<T>) => {
      stateRef.current = produce<EntityStateRecord>(
        stateRef.current,
        (state: EntityStateRecord) => {
          // Foolish TypeScript, won't let me index by symbol, hence `key as string` everywhere
          state[key as string] =
            typeof nextState === "function"
              ? (nextState as Function)(stateRef.current[key as string])
              : nextState;
          return state;
        }
      );
      entities.update(id, stateRef.current);
    },
    [entities]
  );
  const get = useCallback(
    <T>(key: string | symbol): T => stateRef.current[key as string],
    []
  );
  const getFlag = useCallback(
    (key: string | symbol): boolean => !!flagsRef.current[key as string],
    []
  );
  const setFlag = useCallback(
    (key: string | symbol, value: boolean = true): void => {
      flagsRef.current[key as string] = value;
    },
    []
  );

  const context = useMemo<EntityContext>(() => {
    return {
      flags: flagsRef.current,
      state: stateRef.current,
      get,
      update,
      getFlag,
      setFlag
    };
  }, [entities, stateRef.current]);

  useEffect(() => {
    entities.register(id, stateRef.current);
    return () => entities.unregister(id);
  }, [id]);

  useEffect(() => {
    return;
  }, [entities]);

  return [context, id];
};

export const [useEntities, EntitiesProvider] = createContext<EntitiesActions>();
export const [useEntitiesState, EntitiesStateProvider] = createContext<
  EntitiesState
>();
export const [useEntity, EntityProvider] = createContext<EntityContext>();

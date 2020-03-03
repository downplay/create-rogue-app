import { useRef, useMemo, useEffect, useCallback } from "react";
import { v4 } from "uuid";
import {
  EntitiesContext,
  EntityContext,
  EntityStateRecord,
  EntitiesStateRecord
} from "../game/types";
import { createContext } from "../helpers/createContext";
import { produce } from "immer";

export const [useEntities, EntitiesProvider] = createContext<EntitiesContext>();

export const entitiesActions = {
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
    console.log(entities);
    return entities;
  },
  unregister: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    delete entities[id];
    return entities;
  }
};

export const useEntitiesState = (): [EntityContext, string] => {
  const entities = useEntities();
  const id = useMemo(() => v4(), []);
  const stateRef = useRef<EntityStateRecord>({});
  const update = useCallback(
    <T>(key: string | symbol, nextState: T) => {
      stateRef.current = produce<EntityStateRecord>(
        stateRef.current,
        (state: Record<string | symbol, any>) => {
          // Foolish TypeScript, won't let me index by symbol
          state[(key as unknown) as string] = nextState;
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
  const context = useMemo<EntityContext>(
    () => ({
      state: stateRef.current,
      get,
      update
    }),
    [entities]
  );

  useEffect(() => {
    entities.register(id, stateRef.current);
    return () => entities.unregister(id);
  }, [id]);

  useEffect(() => {
    return;
  }, [entities]);

  return [context, id];
};

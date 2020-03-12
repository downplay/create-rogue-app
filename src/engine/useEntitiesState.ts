import { useRef, useMemo, useEffect, useCallback } from "react";
import { v4 } from "uuid";
import { EntitiesStateRecord } from "../game/types";
import { createContext } from "../helpers/createContext";
import { produce } from "immer";
import { EntitiesState, EntitiesActions, SetStateAction } from "../game/types";

const DestroyedKey = Symbol("Destroyed");

export type EntityContext = {
  id: string;
  state: EntityStateRecord;
  get: <T>(key: string | symbol) => T | undefined;
  update: <T>(key: string | symbol, state: SetStateAction<T>) => void;
  getFlag: (key: string | symbol) => boolean;
  setFlag: (key: string | symbol, value?: boolean) => void;
  bindEvent: <T>(
    eventKey: string | symbol,
    handler: (event: T) => void
  ) => () => void;
  fireEvent: <T extends any>(eventKey: string | symbol, event?: T) => void;
  destroy: () => void;
};

export type EntityStateRecord = Record<string | symbol, any>;
export type EntityFlagsRecord = Record<string | symbol, boolean | undefined>;
export type EntityEventsRecord = Record<
  string | symbol,
  ((event: any) => void)[]
>;

export const entitiesMutations = {
  register: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    entities[id] = entityState;
  },
  // TODO: register and update are suspiciously the same, really need two of them?
  update: (id: string, entityState: EntityStateRecord) => (
    entities: EntitiesStateRecord
  ) => {
    entities[id] = entityState;
  },
  unregister: (id: string) => (entities: EntitiesStateRecord) => {
    delete entities[id];
  }
};

export const entitiesQueries = {};

export const useEntityContext = (): [EntityContext, string, boolean] => {
  const entities = useEntities();
  // Note: it looks unused but without this, the component won't update and therefore new state
  // also can't be passed to the children. TODO: Maybe figure out that we don't need the refs and
  // can use purely state from the context.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entitiesState = useEntitiesState();
  const id = useMemo(() => v4(), []);
  const stateRef = useRef<EntityStateRecord>({});

  const update = useCallback(
    <T>(key: string | symbol, nextState: SetStateAction<T>) => {
      // TODO: Appears to fail when more than one update applies in the same tick;
      // clearly something funky is going on and stateRef.current is stale
      const newState = produce<EntityStateRecord>(
        stateRef.current,
        (state: EntityStateRecord) => {
          // Foolish TypeScript, won't let me index by symbol, hence `key as string` everywhere
          const newLocalState =
            typeof nextState === "function"
              ? (nextState as Function)(stateRef.current[key as string])
              : nextState;
          if (newLocalState !== stateRef.current[key as string]) {
            state[key as string] = newLocalState;
          }
        }
      );
      if (newState !== stateRef.current) {
        stateRef.current = newState;
        entities.update(id, stateRef.current);
      }
    },
    [entities]
  );
  const get = useCallback(
    <T>(key: string | symbol): T | undefined => stateRef.current[key as string],
    []
  );
  const flagsRef = useRef<EntityFlagsRecord>({});
  const getFlag = useCallback(
    (key: string | symbol): boolean => !!flagsRef.current[key as string],
    []
  );
  const setFlag = useCallback(
    (key: string | symbol, value: boolean = true): void => {
      if (flagsRef.current[key as string] !== value) {
        flagsRef.current[key as string] = value;
      }
    },
    []
  );

  const eventsRef = useRef<EntityEventsRecord>({});
  const bindEvent = useCallback(
    <T>(eventKey: string | symbol, handler: (event: T) => void) => {
      if (!eventsRef.current[eventKey as string]) {
        eventsRef.current[eventKey as string] = [];
      }
      eventsRef.current[eventKey as string].push(handler);
      return () => {
        eventsRef.current[eventKey as string].splice(
          eventsRef.current[eventKey as string].indexOf(handler),
          1
        );
      };
    },
    []
  );

  const fireEvent = useCallback(<T>(eventKey: string | symbol, event: T) => {
    if (eventsRef.current[eventKey as string]) {
      for (const handler of eventsRef.current[eventKey as string]) {
        handler(event);
      }
    }
  }, []);

  const destroy = useCallback(() => {
    update(DestroyedKey, true);
  }, []);

  // TODO: There's an awful lot of stuff here but technically it is only getting rebound when
  // our state changes (because `entities` is actions and never changes). Should it rebind if flags change?
  const context = useMemo<EntityContext>(() => {
    return {
      id,
      flags: flagsRef.current,
      state: stateRef.current,
      get,
      update,
      getFlag,
      setFlag,
      bindEvent,
      fireEvent,
      destroy
    };
  }, [entities, stateRef.current]);

  useEffect(() => {
    entities.register(id, stateRef.current);
    return () => entities.unregister(id);
  }, [id]);

  return [context, id, !!stateRef.current[(DestroyedKey as unknown) as string]];
};

export const [useEntities, EntitiesProvider] = createContext<EntitiesActions>();
export const [useEntitiesState, EntitiesStateProvider] = createContext<
  EntitiesState
>();
export const [useEntity, EntityProvider] = createContext<EntityContext>();

export const useEvent = <T>(
  key: string | symbol,
  handler: (event: T) => void
) => {
  const entity = useEntity();
  useEffect(() => entity.bindEvent<T>(key, handler), [handler]);
};

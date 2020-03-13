import React, { useMemo, useRef, memo } from "react";
import { EntityStateRecord } from "./useEntitiesState";
import {
  EntitiesProvider,
  EntitiesStateProvider,
  useEntities,
  useEntitiesState
} from "./useEntitiesState";
import {
  EntitiesActions,
  EntitiesStateRecord,
  EntitiesState
} from "../game/types";

/**
 * Performance context grouping.
 * Wraps a group of entities in a ProxyEntityContext to reduce renders; it will pass updates
 * up to the parent context but connected children will only have to re-render if one of the registered
 * entities changes.
 * TODO: How to group things? Need to measure performance. Group the whole map and keep doors separate?
 * Or put a group around just rooms, corridors?
 */
export const EntityGroup = memo(({ children }: React.PropsWithChildren<{}>) => {
  const entities = useEntities();
  const entitiesState = useEntitiesState();

  const groupRef = useRef<EntitiesState>({ state: {} });

  const actions = useMemo<EntitiesActions>(() => {
    // Hijack the parent register and unregister methods to know which entities we're managing.
    // Any other mutations we would handle later when comparing for changes; queries are fine to
    // defer to the parent which will have everything anyway.
    return {
      ...entities,
      register: (id: string, state: EntityStateRecord) => {
        groupRef.current = {
          state: { ...groupRef.current.state, [id]: state }
        };
        entities.register(id, state);
      },
      unregister: (id: string) => {
        groupRef.current = {
          state: {
            ...groupRef.current.state,
            [id]: undefined
          } as EntitiesStateRecord
        };
        entities.unregister(id);
      }
    };
  }, [entities]);

  for (const [id, state] of Object.entries(groupRef.current.state)) {
    if (entitiesState.state[id] !== state) {
      // At least one state has changed, create a new state
      const newState: EntitiesStateRecord = {};
      for (const key of Object.keys(groupRef.current.state)) {
        newState[key] = entitiesState.state[key];
      }
      groupRef.current = { state: newState };
      break;
    }
  }

  return (
    <EntitiesProvider value={actions}>
      <EntitiesStateProvider value={groupRef.current}>
        {children}
      </EntitiesStateProvider>
    </EntitiesProvider>
  );
});

import { useCallback, Dispatch, useEffect } from "react";
import { SetStateAction } from "../game/types";
import { useEntity, EntityContext } from "./useEntitiesState";

export const useEntityState = <T>(
  key: string | symbol,
  initialState?: T
): [T, Dispatch<SetStateAction<T>>] => {
  const entity = useEntity();
  let currentState = entity.get<T>(key);

  if (currentState === undefined && initialState === undefined) {
    throw new Error("State not initialised: " + key.toString());
  }

  if (currentState === undefined) {
    currentState = initialState;
    entity.update(key, initialState);
  }

  // useEffect(() => {
  //   if (initialState && !entity.get(key)) {
  //     entity.update(key, initialState);
  //   }
  // }, [initialState]);

  const setEntityState: Dispatch<SetStateAction<T>> = useCallback(
    (nextState: SetStateAction<T>) => {
      entity.update(key, nextState);
    },
    [entity]
  );

  return [currentState as T, setEntityState];
};

/**
 * Factory to crate a getter function for supplied state key, for code handling a foreign
 * entity that needs to access some of its state. Should avoid setting state externally,.
 * let entities do that themselves in response to events, effects etc.
 */
export const stateGetter = <T>(key: string | symbol, defaultValue?: T) => (
  entity: EntityContext
) => (entity?.state?.[(key as unknown) as string] as T) || defaultValue; // TODO: probable issues with falsy values

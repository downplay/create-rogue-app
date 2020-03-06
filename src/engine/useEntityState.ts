import { useCallback, useEffect, Dispatch } from "react";
import { SetStateAction } from "../game/types";
import { useEntity } from "./useEntitiesState";

export const useEntityState = <T>(
  key: string | symbol,
  initialState?: T
): [T | undefined, Dispatch<SetStateAction<T>>] => {
  const entity = useEntity();

  useEffect(() => {
    if (initialState && !entity.get(key)) {
      entity.update(key, initialState);
    }
  }, [initialState]);

  const setEntityState: Dispatch<SetStateAction<T>> = useCallback(
    (nextState: SetStateAction<T>) => {
      entity.update(key, nextState);
    },
    [entity]
  );

  return [entity.get(key) || initialState, setEntityState];
};

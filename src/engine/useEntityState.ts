import { useCallback, useEffect, Dispatch } from "react";
import { useEntity } from "./entity";
import { SetStateAction } from "../game/types";

export const useEntityState = <T>(
  key: string | symbol,
  initialState: T
): [T, Dispatch<SetStateAction<T>>] => {
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

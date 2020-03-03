import { useCallback, useEffect } from "react";
import { useEntity } from "./entity";

export const useEntityState = <T>(
  key: string | symbol,
  initialState: T
): [T, (nextState: T) => void] => {
  const entity = useEntity();

  useEffect(() => {
    if (initialState && !entity.get(key)) {
      console.log("setting initialState", initialState);
      entity.update(key, initialState);
    }
  }, [initialState]);

  const setEntityState = useCallback(
    (nextState: T) => {
      entity.update(key, nextState);
    },
    [entity]
  );

  return [entity.get(key) || initialState, setEntityState];
};

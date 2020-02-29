import { useCallback, useEffect } from "react";
import { useEntity } from "./entity";

export const useEntityState = <T>(
  key: symbol,
  initialState: T
): [T, (nextState: T) => void] => {
  const entity = useEntity();

  useEffect(() => {
    if (initialState) {
      entity.update(key, initialState);
    }
  }, [initialState]);

  const setEntityState = useCallback(
    (nextState: T) => {
      entity.update(key, nextState);
    },
    [entity]
  );
  return [entity.state[key], setEntityState];
};

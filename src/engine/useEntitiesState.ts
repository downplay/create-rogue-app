import { useRef, useMemo, useEffect } from "react";
import { v4 } from "uuid";
import { EntitiesState, BaseEntitiesState } from '../game/types';
import { createContext } from "../helpers/createContext";

export const [useEntities, EntitiesProvider] = createContext<EntitiesState>();

export const entitiesActions = {
  register: (id:string, entities:BaseEntitiesState) => {
    entities.state[]
  }
}

export const useEntitiesState = (): [EntitiesState, string] => {
  const entities = useEntities();
  const id = useMemo(() => v4(), []);
  const stateRef = useRef<EntitiesState["state"]>();
  if (!stateRef.current) {
    stateRef.current = {};
  }

  const context = useMemo(
    () => ({
      state: stateRef.current,
      updateState: <T>(key: symbol, nextState: T) => {
        entities.update(id, { [key]: nextState });
      }
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

  return [context.state, context.updateState, id];
};


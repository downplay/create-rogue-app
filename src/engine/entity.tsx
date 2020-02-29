import React from "react";
import { useEntitiesState } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import { useMemo } from "react";

export const [useEntity, EntityProvider] = createContext<EntityState>();

export type EntityState = {};

export function entity<TState, TProps>(
  WrappedComponent: React.ComponentType<TProps>
) {
  const [state, context, id] = useEntitiesState();

  return (props: TProps & TState) => (
    <EntityProvider value={context}>
      <WrappedComponent {...props} {...state}></WrappedComponent>
    </EntityProvider>
  );
}

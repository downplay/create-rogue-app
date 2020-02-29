import React from "react";
import { useEntitiesState } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";

export const [useEntity, EntityProvider] = createContext<EntityState>();

export function entity<TState, TProps>(
  WrappedComponent: React.ComponentType<TProps>
): React.ComponentType<TProps> {
  const [state, context, id] = useEntitiesState();

  return (props: TProps) => (
    <EntityProvider value={context}>
      <WrappedComponent {...props} {...state}></WrappedComponent>
    </EntityProvider>
  );
}

import React from "react";
import { useEntitiesState } from "./useEntitiesState";

export const EntityContext = createContext<EntityState>();

export function entity<TState, TProps>(
  WrappedComponent: React.ComponentType<TProps>
) {
  const [state] = useEntitiesState<TState>();

  return (props: TProps & TState) => (
    <EntityContext.Provider state={state}>
      <WrappedComponent {...props} {...state}></WrappedComponent>
    </EntityContext.Provider>
  );
}

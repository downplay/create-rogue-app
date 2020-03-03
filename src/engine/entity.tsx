import React from "react";
import { useEntitiesState } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import { EntityContext } from "../game/types";

export const [useEntity, EntityProvider] = createContext<EntityContext>();

export function entity<TProps>(
  WrappedComponent: React.ComponentType<TProps>
): React.ComponentType<TProps> {
  const entityComponent = (props: TProps) => {
    const [context, id] = useEntitiesState();
    return (
      <EntityProvider value={context}>
        <WrappedComponent {...props}></WrappedComponent>
      </EntityProvider>
    );
  };
  entityComponent.displayName = WrappedComponent.displayName + "Entity";
  return entityComponent;
}

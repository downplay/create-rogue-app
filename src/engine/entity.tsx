import React, { memo } from "react";
import { useEntitiesState } from "./useEntitiesState";
import { createContext } from "../helpers/createContext";
import { EntityContext } from "../game/types";

export const [useEntity, EntityProvider] = createContext<EntityContext>();

export function entity<TProps>(Component: React.ComponentType<TProps>) {
  const MemoComponent: React.ComponentType<TProps> = memo(Component) as any; // silly typescript
  const entityComponent = (props: TProps) => {
    const [context, id] = useEntitiesState();
    return (
      <EntityProvider value={context}>
        <MemoComponent {...props} />
      </EntityProvider>
    );
  };
  entityComponent.displayName = Component.displayName + "Entity";
  return entityComponent;
}

import React, { memo } from "react";
import {
  useEntityContext,
  EntityProvider,
  EntityContext,
} from "./useEntitiesState";

// Note on memoisation here. The inner component (the entity definition) is memoised; we don't want
// all entities and all their hooks re-running every time another entity is updated. Only this
// outer shim will run, the entity will only update if its own context has changed or something
// it directly depends on.
export function entity<TProps>(
  Component: React.ComponentType<TProps>
): React.ComponentType<
  TProps & { entityRef: React.MutableRefObject<EntityContext> }
> {
  const MemoComponent: React.ComponentType<TProps> = memo(Component) as any; // silly typescript
  const entityComponent = (props: TProps) => {
    // TODO: derive initial state values automatically from props
    const [context, id, destroyed] = useEntityContext();
    return destroyed ? null : (
      <EntityProvider value={context}>
        <MemoComponent {...props} />
      </EntityProvider>
    );
  };
  entityComponent.displayName = Component.displayName + "Entity";
  return entityComponent;
}

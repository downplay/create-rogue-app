import React, { memo } from "react";
import {
  useEntityContext,
  EntityProvider,
  EntityContext,
} from "./useEntitiesState";

type EntityFactoryProps<TState> = {
  game: Game,
  state: TState
}

export function entity<TState>(
  factory: 
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

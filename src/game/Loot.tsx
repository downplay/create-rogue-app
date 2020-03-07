import React from "react";
import { entity } from "../engine/entity";
import { hasSpawnPosition } from "../engine/recipes/hasSpawnPosition";
import { useEntity } from "../engine/useEntitiesState";
import { onTake } from "../engine/hasInventory";

export const Loot: React.ComponentType<React.PropsWithChildren<{}>> = entity(
  ({ children }: React.PropsWithChildren<{}>) => {
    hasSpawnPosition();
    const entity = useEntity();
    onTake(() => {
      entity.destroy();
    });

    return <>{children}</>;
  }
);

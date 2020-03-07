import React from "react";
import { entity } from "../engine/entity";
import { hasSpawnPosition } from "../engine/recipes/hasSpawnPosition";

export const Loot: React.ComponentType<React.PropsWithChildren<{}>> = entity(
  ({ children }: React.PropsWithChildren<{}>) => {
    hasSpawnPosition();
    return <>{children}</>;
  }
);

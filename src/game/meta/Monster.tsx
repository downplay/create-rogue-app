import React from "react";
import { hasSpawnPosition } from "../../engine/recipes/hasSpawnPosition";
import { canLiveAndDie } from "../../engine/hasLife";

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  hasSpawnPosition();
  canLiveAndDie();

  return <>{children}</>;
};

import React from "react";
import { hasSpawnPosition } from "../../engine/recipes/hasSpawnPosition";
import { canLiveAndDie } from "../../engine/hasLife";
import { isMonster } from "../../engine/flags";

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  isMonster();
  hasSpawnPosition();
  canLiveAndDie();

  return <>{children}</>;
};

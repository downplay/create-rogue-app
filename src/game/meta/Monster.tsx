import React from "react";
import styled from "styled-components";
import { hasSpawnPosition } from "../../engine/recipes/hasSpawnPosition";

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  hasSpawnPosition();

  return <>{children}</>;
};

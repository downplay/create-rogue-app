import React from "react";
import styled from "styled-components";
import { hasSpawnPosition } from "../../engine/recipes/hasSpawnPosition";

export const Description = styled.h1``;
export const Name = styled.h1``;

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  hasSpawnPosition();

  return <>{children}</>;
};

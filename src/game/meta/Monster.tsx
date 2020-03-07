import React from "react";
import styled from "styled-components";
import { hasSpawnPosition } from "../../engine/recipes/hasSpawnPosition";

export const Description = styled.h1``;
export const Name = styled.h1``;

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  hasSpawnPosition();

  return <>{children}</>;
};

export const Card = ({ children }: React.PropsWithChildren<{}>) => {
  if (false) {
    // todo: render children to portal for rollover
    return <>children</>;
  }
  return null;
};

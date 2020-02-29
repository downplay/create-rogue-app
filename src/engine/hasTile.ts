import React, { useContext, useEffect } from "react";
import { GridContext } from "./RogueContext";
import { hasPosition } from "./hasPosition";

export const hasTile = (TileComponent: React.ComponentType) => {
  const grid = useContext(GridContext);

  const [position] = hasPosition();

  useEffect(() => {
    grid.addTile(position, TileComponent);
  }, [position, TileComponent, grid]);
};

export const tile = (char: string) => () => <>{char}</>;

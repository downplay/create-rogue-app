import React, { useEffect } from "react";
import { hasPosition } from "./hasPosition";
import { useGrid } from "./grid";

export const hasTile = (TileComponent: React.ComponentType) => {
  const grid = useGrid();

  const [position] = hasPosition();

  useEffect(() => {
    const tileHandle = grid.addTile(position, TileComponent);
    return grid.removeTile(tileHandle);
  }, [position, TileComponent, grid]);
};

export const tile = (glyph: string) => () => <>{glyph}</>;

import React, { useEffect } from "react";
import { hasPosition } from "./hasPosition";
import { useGrid } from "./grid";

export const hasTile = (TileComponent: React.ComponentType) => {
  const { addTile, removeTile } = useGrid();

  const [position] = hasPosition();

  useEffect(() => {
    const tileHandle = addTile(position, TileComponent);
    return () => removeTile(tileHandle);
  }, [position, TileComponent, addTile, removeTile]);
};

export const tile = (glyph: string) => () => <>{glyph}</>;

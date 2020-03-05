import React, { useEffect } from "react";
import { hasPosition } from "./hasPosition";
import { useGrid } from "./grid";

export const hasTile = (TileComponent: React.ComponentType, z?: number) => {
  const { addTile, removeTile } = useGrid();

  const [position] = hasPosition();

  // TODO: z to be inferred from entity layer

  useEffect(() => {
    const tileHandle = addTile(position, TileComponent, z);
    return () => removeTile(tileHandle);
  }, [position, TileComponent, addTile, removeTile]);
};

export const tile = (glyph: string) => () => <>{glyph}</>;

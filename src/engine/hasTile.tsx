import React, { useEffect } from "react";
import { hasPosition } from "./hasPosition";
import { useGrid, GridLayers } from "./grid";
import { useEntity } from "./useEntitiesState";
import { Emoji } from "../ui/Typography";

export type TileProps = {
  TileComponent?: React.ComponentType;
};

export const hasTile = (
  TileComponent: React.ComponentType,
  layer?: GridLayers
) => {
  const entity = useEntity();
  const { addTile, removeTile } = useGrid();

  const [position] = hasPosition(null);

  useEffect(() => {
    if (position) {
      const tileHandle = addTile(position, TileComponent, layer, entity);
      return () => removeTile(tileHandle);
    }
  }, [position, TileComponent, addTile, removeTile]);
};

export const tile = (glyph: string) => () => <Emoji>{glyph}</Emoji>;

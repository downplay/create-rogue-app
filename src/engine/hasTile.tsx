import React, { useEffect, useRef } from "react";
import { hasPosition } from "./hasPosition";
import { useGrid, GridLayers, TileHandle, Tile } from "./grid";
import { useEntity } from "./useEntitiesState";
import { Emoji } from "../ui/Typography";

export type TileProps = {
  TileComponent?: React.ComponentType;
};

export const hasTile = <T extends {}, S>(
  TileComponent: React.ComponentType<T>,
  layer?: GridLayers,
  state?: S
) => {
  const entity = useEntity();
  const { addTile, removeTile, updateTileState } = useGrid();

  const [position] = hasPosition(null);

  const tileRef = useRef<Tile>();

  useEffect(() => {
    if (position) {
      tileRef.current = addTile(position, TileComponent, layer, entity, state);
      // TODO: If only position changed, move the tile instead of replace
      return () => removeTile(tileRef.current!);
    }
  }, [position, TileComponent, addTile, removeTile]);

  useEffect(() => {
    // TODO: Hmm ... could go on main effect
    if (tileRef.current && tileRef.current.state !== state) {
      updateTileState(tileRef.current, state);
    }
  }, [state]);
};

export const tile = (glyph: string) => () => <Emoji>{glyph}</Emoji>;

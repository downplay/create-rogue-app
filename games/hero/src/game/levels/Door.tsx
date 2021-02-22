import React from "react";
import { hasTile, TileProps } from "../../engine/hasTile";
import { entity } from "../../engine/entity";
import { PositionProps, hasPosition } from "../../engine/hasPosition";
import { Emoji } from "../../ui/Typography";
import { onInteract, InteractEvent } from "../../engine/canInteractWith";
import { Handler } from "../../engine/useEntitiesState";

export const DoorTile = () => <Emoji>🚪</Emoji>;

export type DoorProps = PositionProps &
  TileProps & {
    onEnter?: Handler<InteractEvent>;
  };

export const Door = entity(
  ({ position, TileComponent = DoorTile, onEnter }: DoorProps) => {
    hasPosition(position);
    hasTile(TileComponent);
    onInteract(onEnter);
    return null;
  }
);

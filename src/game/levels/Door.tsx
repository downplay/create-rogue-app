import React from "react";
import { isSpawnPosition } from "../../engine/flags";
import { hasTile } from "../../engine/hasTile";
import { entity } from "../../engine/entity";
import { PositionProps, hasPosition } from "../../engine/hasPosition";
import { Emoji } from "../../ui/Typography";

export const DoorTile = () => <Emoji>🚪</Emoji>;

export const Door = entity(({ position }: PositionProps) => {
  hasPosition(position);
  hasTile(DoorTile);
  return null;
});

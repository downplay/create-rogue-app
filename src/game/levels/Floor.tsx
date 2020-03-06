import React from "react";
import { Ascii } from "../../ui/Typography";
import { isSpawnPosition } from "../../engine/flags";
import { hasTile } from "../../engine/hasTile";
import { entity } from "../../engine/entity";
import { PositionProps, hasPosition } from "../../engine/hasPosition";

const SLATE_1 = "#49394E";
const SLATE_2 = "#59506C";

export const FloorTile = () => (
  <Ascii fore={SLATE_1} back={SLATE_2}>
    ▞
  </Ascii>
);

export const Floor = entity(({ position }: PositionProps) => {
  hasPosition(position);
  hasTile(FloorTile);
  isSpawnPosition();
  return null;
});

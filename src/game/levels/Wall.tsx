import React from "react";
import { Ascii } from "../../ui/Typography";
import { entity } from "../../engine/entity";
import { hasPosition, PositionProps } from "../../engine/hasPosition";
import { hasTile } from "../../engine/hasTile";
import { isSolid } from "../../engine/flags";

const BRICK_RED = "#4E2B1A";
const BRICK_YELLOW = "#715323";

export const WallTile = () => (
  <Ascii fore={BRICK_RED} back={BRICK_YELLOW}>
    ▓
  </Ascii>
);

export const Wall = entity(({ position }: PositionProps) => {
  hasPosition(position);
  hasTile(WallTile);
  isSolid();
  return null;
});

import React from "react";
import { simpleTileEntity } from "../../engine/factories/simpleSpriteEntity";
import { Ascii } from "../../ui/Typography";

const BRICK_RED = "#4E2B1A";
const BRICK_YELLOW = "#715323";

export const WallTile = () => (
  <Ascii fore={BRICK_RED} back={BRICK_YELLOW}>
    ▓
  </Ascii>
);

export const Wall = simpleTileEntity("Wall", WallTile);

import React from "react";
import { simpleTileEntity } from "../../engine/factories/simpleSpriteEntity";
import { Ascii } from "../../ui/Typography";

const SLATE_1 = "#49394E";
const SLATE_2 = "#59506C";

export const FloorTile = () => (
  <Ascii fore={SLATE_1} back={SLATE_2}>
    ▞
  </Ascii>
);

export const Floor = simpleTileEntity("Floor", FloorTile);

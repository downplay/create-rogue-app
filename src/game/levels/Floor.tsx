import React from "react";
import { Ascii } from "../../ui/Typography";
import { isSpawn } from "../../engine/flags";
import { hasTile, TileProps } from "../../engine/hasTile";
import { entity } from "../../engine/entity";
import { PositionProps, hasPosition } from "../../engine/hasPosition";

const SLATE_1 = "#49394E";
const SLATE_2 = "#59506C";

export const FloorTile = () => (
  <Ascii fore={SLATE_1} back={SLATE_2}>
    ▞
  </Ascii>
);

export const Floor = entity(
  ({
    position,
    TileComponent = FloorTile,
    children
  }: React.PropsWithChildren<PositionProps & TileProps>) => {
    hasPosition(position);
    isSpawn();
    hasTile(TileComponent);
    return <>{children}</>;
  }
);

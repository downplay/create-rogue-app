import React, { useEffect } from "react";
import styled from "styled-components";
import { hasPosition } from "../../engine/hasPosition";
import { useGrid, useGridState } from "../../engine/grid";
import { useRng } from "../../engine/useRng";
import { SOLID_FLAG, SPAWN_POSITION_FLAG } from "../../engine/flags";

export const Description = styled.h1``;
export const Name = styled.h1``;

export const Monster = ({ children }: React.PropsWithChildren<{}>) => {
  // Find spawn
  const [position, setPosition] = hasPosition();
  const grid = useGrid();
  const gridState = useGridState();
  const random = useRng();

  useEffect(() => {
    if (position) {
      return;
    }
    const tiles = grid.findTiles((tile, cell) => {
      console.log(cell.tiles.length);
      console.log(tile);
      return (
        tile.entity?.getFlag(SPAWN_POSITION_FLAG) &&
        !cell.tiles.find(otherTile => otherTile.entity?.getFlag(SOLID_FLAG))
      );
    });
    console.log(tiles);
    if (tiles.length) {
      const chosen = random.pick(tiles);
      setPosition(chosen.position);
    }
  }, [gridState]);

  return <>{children}</>;
};

export const Card = ({ children }: React.PropsWithChildren<{}>) => {
  if (false) {
    // todo: render children to portal for rollover
    return <>children</>;
  }
  return null;
};

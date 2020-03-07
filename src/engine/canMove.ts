import { Vector, add } from "./vector";
import { hasPosition } from "./hasPosition";
import { useCallback } from "react";
import { useGrid } from "./grid";
import { SOLID_FLAG } from "./flags";

export const canMove = () => {
  const [position, setPosition] = hasPosition();
  const grid = useGrid();

  const move = useCallback(
    (delta: Vector) => {
      setPosition(position => {
        const next = add(position, delta);
        const cell = grid.getCell(next);
        if (cell.tiles.find(tile => tile.entity?.getFlag(SOLID_FLAG))) {
          return position;
        }
        return next;
      });
    },
    [position]
  );
  return [move];
};

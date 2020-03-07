import { Vector, add } from "./vector";
import { hasPosition } from "./hasPosition";
import { useCallback } from "react";
import { useGrid } from "./grid";
import { SOLID_FLAG } from "./flags";
import { hasDeath } from "./hasLife";

export const canMove = () => {
  const [, setPosition] = hasPosition();
  const grid = useGrid();
  const [isDead] = hasDeath();

  const move = useCallback(
    (delta: Vector) => {
      if (isDead) {
        return;
      }
      setPosition(currentPosition => {
        if (currentPosition === null) {
          return currentPosition;
        }
        if (currentPosition === undefined) {
          throw new Error("Was not expecting undefined position");
        }
        const next = add(currentPosition, delta);
        const cell = grid.getCell(next);
        if (cell.tiles.find(tile => tile.entity?.getFlag(SOLID_FLAG))) {
          return currentPosition;
        }
        return next;
      });
    },
    [setPosition]
  );

  return [move];
};

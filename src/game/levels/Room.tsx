import React, { useMemo } from "react";
import { Vector, vector } from "../../engine/vector";
import { Wall } from "./Wall";

type Props = {
  size: Vector;
};

export const Room = ({ size }: Props) => {
  const tiles = useMemo(() => {
    const tiles = [];
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
        // TODO: Probably an id
        const key = `${x}_${y}`;
        tiles.push(
          x === 0 || y === 0 || x === size.x - 1 || y === size.y - 1 ? (
            <Wall key={key} position={vector(x, y)} />
          ) : (
            <Floor key={key} position={vector(x, y)} />
          )
        );
      }
    }
  }, [size]);

  return <>{tiles}</>;
};

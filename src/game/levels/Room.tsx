import React, { useMemo, memo, PropsWithChildren } from "react";
import { Vector, vector } from "../../engine/vector";
import { Wall } from "./Wall";
import { Floor } from "./Floor";

type Props = {
  size: Vector;
};

export const Room = memo(({ size, children }: PropsWithChildren<Props>) => {
  const tiles = useMemo(() => {
    const tiles = [];
    for (let x = 0; x < size.x; x++) {
      for (let y = 0; y < size.y; y++) {
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
    return tiles;
  }, [size]);

  return (
    <>
      {tiles}
      {children}
    </>
  );
});

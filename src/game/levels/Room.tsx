import React, { useMemo, memo, PropsWithChildren } from "react";
import { Vector, vector, VECTOR_ORIGIN, add } from "../../engine/vector";
import { Wall } from "./Wall";
import { Floor } from "./Floor";

type Props = {
  origin?: Vector;
  size: Vector;
};

export const Room = memo(
  ({ origin = VECTOR_ORIGIN, size, children }: PropsWithChildren<Props>) => {
    // TODO: Wall/Floor, to be overridable in props, but also can be derived from current biome
    const tiles = useMemo(() => {
      const tiles = [];
      for (let x = 0; x < size.x; x++) {
        for (let y = 0; y < size.y; y++) {
          const key = `${x}_${y}`;
          tiles.push(
            x === 0 || y === 0 || x === size.x - 1 || y === size.y - 1 ? (
              <Wall key={key} position={add(origin, vector(x, y))} />
            ) : (
              <Floor key={key} position={add(origin, vector(x, y))} />
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
  }
);

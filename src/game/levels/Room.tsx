import React, { useMemo, memo, PropsWithChildren } from "react";
import {
  Vector,
  vector,
  VECTOR_ORIGIN,
  add,
  equals
} from "../../engine/vector";
import { Wall } from "./Wall";
import { Floor } from "./Floor";
import { Door } from "./Door";

export type RoomProps = {
  origin?: Vector;
  size: Vector;
  doors?: Vector[];
};

export const Room = memo(
  ({
    origin = VECTOR_ORIGIN,
    size,
    doors = [],
    children
  }: PropsWithChildren<RoomProps>) => {
    // TODO: Wall/Floor, to be overridable in props, but also can be derived from current biome
    const tiles = useMemo(() => {
      const tiles = [];
      for (let x = 0; x < size.x; x++) {
        for (let y = 0; y < size.y; y++) {
          const key = `${x}_${y}`;
          const position = vector(x, y);
          if (doors.find(door => equals(door, position))) {
            tiles.push(<Door key={key} position={add(origin, vector(x, y))} />);
          } else {
            tiles.push(
              x === 0 || y === 0 || x === size.x - 1 || y === size.y - 1 ? (
                <Wall key={key} position={add(origin, vector(x, y))} />
              ) : (
                <Floor key={key} position={add(origin, vector(x, y))} />
              )
            );
          }
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

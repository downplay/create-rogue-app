import React, { useMemo, memo, PropsWithChildren } from "react";
import { Vector, VECTOR_ORIGIN, add, equals, vectorKey } from "@hero/text";
import { Wall } from "./Wall";
import { Floor } from "./Floor";
import { Door, DoorState } from "./Door";
import { reduceQuad, VECTOR_NW } from "@hero/text";
import { PositionProps } from "../../engine/hasPosition";

export type RoomProps = {
  origin?: Vector;
  size: Vector;
  doors?: Vector[];
  WallComponent?: React.ComponentType<PositionProps>;
  FloorComponent?: React.ComponentType<PositionProps>;
  DoorComponent?: React.ComponentType<DoorProps>;
};

export const Room = memo(
  ({
    origin = VECTOR_ORIGIN,
    size,
    doors = [],
    children,
    WallComponent = Wall,
    FloorComponent = Floor,
    DoorComponent = Door,
  }: PropsWithChildren<RoomProps>) => {
    // TODO: Wall/Floor, to be overridable in props, but also can be derived from current biome
    const tiles = useMemo(() => {
      const tiles = reduceQuad<JSX.Element>(
        VECTOR_ORIGIN,
        add(size, VECTOR_NW),
        (position) => {
          const { x, y } = position;
          const key = vectorKey(position);
          const found = doors.find((door) => equals(door, position));
          if (found) {
            return <DoorComponent key={key} position={add(origin, position)} />;
          }
          return x === 0 || y === 0 || x === size.x - 1 || y === size.y - 1 ? (
            <WallComponent key={key} position={add(origin, position)} />
          ) : (
            <FloorComponent key={key} position={add(origin, position)} />
          );
        }
      );
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

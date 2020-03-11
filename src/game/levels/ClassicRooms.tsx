import React from "react";
import { useRng } from "../../engine/useRng";
import { useMemo } from "react";
import { Room, RoomProps } from "./Room";
import { vector, Vector } from "../../engine/vector";
import { CorridorOrientation } from "./Corridor";

const MAX_SIZE = 20;
const ROOM_COUNTS = vector(4, 4);

enum Direction {
  North,
  East,
  South,
  West
}

type Connection = {
  to: Vector;
  door: Vector;
  orientation: CorridorOrientation;
};

type Connections = Record<Direction, Connection | undefined>;

type RoomDef = RoomProps & {
  connections: Connections;
  position: Vector;
};

/**
 * Classic Rogue/DCSS layout with a 4x4 grid of interconnected rooms
 */
export const ClassicRooms = () => {
  const rng = useRng();

  const generated = useMemo(() => {
    const rooms: RoomDef[][] = [];
    for (let x = 0; x < ROOM_COUNTS.x; x++) {
      rooms[x] = [];
      for (let y = 0; y < ROOM_COUNTS.y; y++) {
        const x1 = rng.integer(1, MAX_SIZE / 2);
        const x2 = rng.integer(x1 + 2, MAX_SIZE);
        const y1 = rng.integer(1, MAX_SIZE / 2);
        const y2 = rng.integer(y1 + 2, MAX_SIZE);
        // TODO: With some more vector helpers, would be:
        // const origin = add(topLeft, mul(vector(x,y), MAX_SIZE))
        // Making me think, should have: random vector methods; 2D iterators
        const origin = {
          x: x1 + x * MAX_SIZE,
          y: y1 + y * MAX_SIZE
        };
        const size = {
          x: x2 - x1 + 1,
          y: y2 - y1 + 1
        };
        console.log(size);
        const connections: Connections = {
          [Direction.North]:
            y > 0
              ? {
                  to: vector(x, y - 1),
                  door: vector(rng.integer(1, size.x), 0),
                  orientation: CorridorOrientation.Vertical
                }
              : undefined,
          [Direction.East]:
            x < ROOM_COUNTS.x - 1
              ? {
                  to: vector(x + 1, y),
                  door: vector(size.x - 1, rng.integer(1, size.y)),
                  orientation: CorridorOrientation.Horizontal
                }
              : undefined,
          [Direction.South]:
            y < ROOM_COUNTS.y - 1
              ? {
                  to: vector(x, y + 1),
                  door: vector(rng.integer(1, size.x), size.y - 1),
                  orientation: CorridorOrientation.Vertical
                }
              : undefined,
          [Direction.West]:
            x > 0
              ? {
                  to: vector(x - 1, y),
                  door: vector(rng.integer(1, size.x), 0),
                  orientation: CorridorOrientation.Horizontal
                }
              : undefined
        };

        const doors = Object.values(connections)
          .filter(connection => !!connection)
          .map(connection => (connection as Connection).door);

        rooms[x][y] = {
          origin,
          size,
          doors,
          connections,
          position: vector(x, y)
        };
      }
    }

    const elements = rooms
      .flat()
      .map(({ origin, size, doors }, i) => (
        <Room key={i} origin={origin} size={size} doors={doors} />
      ));
    return elements;
  }, []);

  return <>{generated}</>;
};

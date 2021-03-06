import React from "react";
import { useRng } from "../../engine/useRng";
import { useMemo } from "react";
import { Room, RoomProps } from "./Room";
import {
  vector,
  Vector,
  VECTOR_E,
  add,
  VECTOR_W,
  VECTOR_S,
} from "../../math/vector";
import { CorridorOrientation, CorridorProps, Corridor } from "./Corridor";
import { omitUndefined } from "../../engine/helpers";
import { VECTOR_N } from "../../math/vector";
import { EntityGroup } from "../../engine/EntityGroup";

const MAX_SIZE = 20;
const ROOM_COUNTS = vector(4, 4);

enum Direction {
  North,
  East,
  South,
  West,
}

type Connection = {
  to: Vector;
  door?: Vector;
};

type Connections = Record<Direction, Connection>;

type RoomDef = RoomProps & {
  connections: Connections;
  position: Vector;
};

/**
 * Classic Rogue/DCSS layout with a 4x4 grid of interconnected rooms
 *
 * TODO: A generalised algorithm with subdivision that can create such layouts but much more
 */
export const ClassicRooms = () => {
  const rng = useRng();

  const generated = useMemo(() => {
    const rooms: RoomDef[][] = [];
    const corridors: CorridorProps[] = [];
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
          y: y1 + y * MAX_SIZE,
        };
        const size = {
          x: x2 - x1 + 1,
          y: y2 - y1 + 1,
        };
        const connections: Connections = {
          [Direction.North]: {
            to: vector(x, y - 1),
            door: y > 0 ? vector(rng.integer(1, size.x - 1), 0) : undefined,
          },
          [Direction.East]: {
            to: vector(x + 1, y),
            door:
              x < ROOM_COUNTS.x - 1
                ? vector(size.x - 1, rng.integer(1, size.y - 1))
                : undefined,
          },
          [Direction.South]: {
            to: vector(x, y + 1),
            door:
              y < ROOM_COUNTS.y - 1
                ? vector(rng.integer(1, size.x - 1), size.y - 1)
                : undefined,
          },
          [Direction.West]: {
            to: vector(x - 1, y),
            door: x > 0 ? vector(0, rng.integer(1, size.y - 1)) : undefined,
          },
        };

        const doors = omitUndefined(
          Object.values(connections).map((connection) => connection.door)
        );

        rooms[x][y] = {
          origin,
          size,
          doors,
          connections,
          position: vector(x, y),
        };

        // Corridor to W room
        if (x > 0) {
          const connection = connections[Direction.West];
          const target = rooms[connection.to.x][connection.to.y];
          corridors.push({
            start: add(
              VECTOR_E,
              target.connections[Direction.East].door as Vector,
              target.origin as Vector
            ),
            end: add(VECTOR_W, connection.door as Vector, origin),
            orientation: CorridorOrientation.Horizontal,
          });
        }
        // Corridor to N room
        if (y > 0) {
          const connection = connections[Direction.North];
          const target = rooms[connection.to.x][connection.to.y];
          corridors.push({
            start: add(
              VECTOR_S,
              target.connections[Direction.South].door as Vector,
              target.origin as Vector
            ),
            end: add(VECTOR_N, connection.door as Vector, origin),
            orientation: CorridorOrientation.Vertical,
          });
        }
      }
    }

    const roomElements = rooms
      .flat()
      // TODO: Randomise the types of rooms; pick from themes based on dungeon
      //       biome to populate room with appropriate mobs
      .map(({ origin, size, doors }, i) => (
        <Room key={`room${i}`} origin={origin} size={size} doors={doors} />
      ));

    return roomElements.concat(
      corridors.map((corridor, i) => (
        <Corridor key={`corridor${i}`} {...corridor} />
      ))
    );
  }, []);

  return <EntityGroup>{generated}</EntityGroup>;
};

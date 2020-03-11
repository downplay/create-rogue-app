import React from "react";
import { useRng } from "../../engine/useRng";
import { useMemo } from "react";
import { Room } from "./Room";

const MAX_SIZE = 20;

/**
 * Classic Rogue/DCSS layout with a 4x4 grid of interconnected rooms
 */
export const ClassicRooms = () => {
  const rng = useRng();

  const generated = useMemo(() => {
    const rooms = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
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
          x: x2 - x1,
          y: y2 - y1
        };
        rooms.push({
          origin,
          size
        });
      }
    }
    console.log(rooms);
    const elements = rooms.map((room, i) => <Room key={i} {...room} />);
    return elements;
  }, []);

  return <>{generated}</>;
};

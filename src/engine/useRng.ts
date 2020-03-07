import { useMemo } from "react";
import { elements, sum } from "./helpers";

type RNG = {
  raw: () => number;
  range: (min: number, max: number) => number;
  integer: (min: number, max: number) => number;
  pick: <T>(items: T[]) => T;
  dice: (count: number, sides: number) => number;
};

export const useRng = (): RNG => {
  // Some reqs.
  //  - Take initial seed for repeatable games
  //  - RNG should be able to restore exact sequence from saved seed
  //  - Single RNG shared across context
  //  - Good algo
  // Cheating: for now just Math.random()
  return useMemo<RNG>(() => {
    const integer = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min) + min);

    return {
      raw: () => Math.random(),
      range: (min, max) => Math.random() * (max - min) + min,
      integer,
      pick: <T>(items: T[]) => items[integer(0, items.length)],
      dice: (count: number, sides: number) =>
        sum(elements(count, () => integer(1, sides)))
    };
  }, []);
};

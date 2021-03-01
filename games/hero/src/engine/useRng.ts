import { useMemo } from "react";
import { createRng, RNG } from "herotext";

export const useRng = (): RNG => {
  // Some reqs.
  //  - Take initial seed for repeatable games
  //  - RNG should be able to restore exact sequence from saved seed
  //  - Single RNG shared across context
  //  - Good algo
  // Cheating: for now just Math.random()
  return useMemo<RNG>(() => {
    return createRng();
  }, []);
};

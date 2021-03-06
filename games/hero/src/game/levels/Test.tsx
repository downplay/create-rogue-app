import React, { useMemo } from "react";
import { vector } from "../../math/vector";
import { Room } from "./Room";
import { Rat } from "../monsters/Rat";
import { useRng } from "../../engine/useRng";
import { Gold } from "../items/Gold";
import { Loot } from "../Loot";
import { Bat } from "../monsters/Bat";
import { elements } from "../../engine/helpers";

// const ROOM_SIZE = vector(4, 4);
const ROOM_SIZE = vector(20, 20);

export const Test = () => {
  const random = useRng();
  // TODO: Started to need something like this a few times now. Memo isn't the right thing here. It
  // wouldn't saveable. We need a hook that will do the following:
  //  * Run instantly when component renders, not in effect
  //  * Store a value in persistable state
  //  * Remove value from state if component actually unmounts
  //  * Doesn't trigger a render, never changes
  const golds = useMemo(() => {
    const num = random.integer(2, 5);
    return elements(num, () => random.integer(1, 11));
  }, []);
  return (
    <Room size={ROOM_SIZE}>
      <Rat />
      <Rat />
      <Rat />
      <Rat />
      <Rat />
      <Rat />
      <Bat />
      <Bat />
      <Bat />
      {golds.map((amount, index) => (
        <Loot key={index}>
          <Gold amount={amount} />
        </Loot>
      ))}
    </Room>
  );
};

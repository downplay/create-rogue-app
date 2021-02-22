import React, { useMemo } from "react";
import { Rat } from "../monsters/Rat";
import { useRng } from "../../engine/useRng";
import { Gold } from "../items/Gold";
import { Loot } from "../Loot";
import { Bat } from "../monsters/Bat";
import { elements } from "../../engine/helpers";

export const TestLint = () => {
  const random = useRng();
  // TODO: Started to need something like this a few times now. Memo isn't the right thing here. It
  // wouldn't be rehydrateable. We need a hook that will do the following:
  //  * Run instantly when component renders, not in effect
  //  * Store a value in persistable state
  //  * Remove value from state if component actually unmounts
  //  * Doesn't trigger a render by itself, never changes
  const golds = useMemo(() => {
    const num = random.integer(2, 5);
    return elements(num, () => random.integer(1, 11));
  }, []);
  return (
    <>
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
    </>
  );
};

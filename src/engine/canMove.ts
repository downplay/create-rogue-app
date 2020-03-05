import { Vector, add } from "./vector";
import { hasPosition } from "./hasPosition";
import { useCallback } from "react";

export const canMove = () => {
  const [position, setPosition] = hasPosition();
  const move = useCallback(
    (delta: Vector) => {
      setPosition(position => add(position, delta));
    },
    [position]
  );
  return [move];
};

import { Vector, add } from "./vector";
import { hasPosition } from "./hasPosition";
import { useCallback } from "react";
export const canMove = () => {
  const [position, setPosition] = hasPosition();

  const move = useCallback(
    (delta: Vector) => {
      setPosition(add(position, delta));
    },
    [position]
  );
  return [move];
};

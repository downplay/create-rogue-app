import { Vector, ORIGIN } from "./vector";
import { useEntityState } from "./useEntityState";

export type PositionProps = { position: Vector };

const PositionKey = Symbol("Position");

export const hasPosition = (position: Vector = ORIGIN) => {
  const [currentPosition, setPosition] = useEntityState(PositionKey, position);
  return [currentPosition, setPosition];
};

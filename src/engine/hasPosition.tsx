import { Vector } from "./vector";

export type PositionProps = { position: Vector };

const PositionKey = Symbol("Position");

export const hasPosition = position => {
  const [currentPosition, setPosition] = useEntityState(PositionKey, position);
  return [currentPosition, setPosition];
};

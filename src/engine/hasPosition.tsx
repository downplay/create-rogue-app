import { Dispatch } from "react";
import { Vector } from "./vector";
import { useEntityState } from "./useEntityState";
import { SetStateAction } from "../game/types";

export type PositionProps = { position: Vector };

const PositionKey = Symbol("Position");

export const hasPosition = (
  position?: Vector
): [Vector | undefined, Dispatch<SetStateAction<Vector>>] => {
  const [currentPosition, setPosition] = useEntityState<Vector>(
    PositionKey,
    position
  );
  return [currentPosition, setPosition];
};

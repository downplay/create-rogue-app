import { Dispatch } from "react";
import { Vector } from "./vector";
import { useEntityState } from "./useEntityState";
import { SetStateAction } from "../game/types";

export type PositionProps = { position: Vector };

const PositionKey = Symbol("Position");

export const hasPosition = (
  position?: Vector | null
): [Vector | null, Dispatch<SetStateAction<Vector | null>>] => {
  const [currentPosition, setPosition] = useEntityState<Vector | null>(
    PositionKey,
    position
  );
  return [currentPosition, setPosition];
};

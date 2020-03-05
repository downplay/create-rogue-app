import { Dispatch } from "react";
import { Vector, ORIGIN } from "./vector";
import { useEntityState } from "./useEntityState";
import { SetStateAction } from "../game/types";

export type PositionProps = { position: Vector };

const PositionKey = Symbol("Position");

export const hasPosition = (
  position: Vector = ORIGIN
): [Vector, Dispatch<SetStateAction<Vector>>] => {
  const [currentPosition, setPosition] = useEntityState(PositionKey, position);
  return [currentPosition, setPosition];
};

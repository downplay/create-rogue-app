import { hasMonsterTurn } from "./hasMonsterTurn";
import { useRng } from "../../engine/useRng";
import { canMove } from "../../engine/canMove";
import {
  VECTOR_ORIGIN,
  VECTOR_N,
  VECTOR_NE,
  VECTOR_E,
  VECTOR_SE,
  VECTOR_S,
  VECTOR_SW,
  VECTOR_W,
  VECTOR_NW
} from "../../engine/vector";

const moves = [
  VECTOR_ORIGIN,
  VECTOR_N,
  VECTOR_NE,
  VECTOR_E,
  VECTOR_SE,
  VECTOR_S,
  VECTOR_SW,
  VECTOR_W,
  VECTOR_NW
];

export const hasRandomMovement = () => {
  const random = useRng();
  const [move] = canMove();
  hasMonsterTurn(() => {
    console.log("turn");
    move(random.pick(moves));
  });
};

import { text } from "herotext";
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
  VECTOR_NW,
} from "herotext";

const moves = [
  VECTOR_ORIGIN,
  VECTOR_N,
  VECTOR_NE,
  VECTOR_E,
  VECTOR_SE,
  VECTOR_S,
  VECTOR_SW,
  VECTOR_W,
  VECTOR_NW,
];

export const canMove = text`
move: ($vector)
${({ vector, entity, speed }) => {
  entity.move(vector);
  return waitTurns(length(vector) / speed);
}}
`;

export const randomMovement = text`
${hasTurn}
${canMove}

turn:~
// Low chance if any other move is more pressing (e.g. attack)
{1%}$move($randomMovementDirection) 

randomMovementDirection:
< 0, 0>
< 0, 1>
< 1, 0>
< 0,-1>
<-1, 0>
< 1, 1>
<-1,-1>
<-1, 1>
< 1,-1>
`;

export const hasRandomMovement = () => {
  const random = useRng();
  const [move] = canMove();
  hasMonsterTurn(() => {
    move(random.pick(moves));
  });
};

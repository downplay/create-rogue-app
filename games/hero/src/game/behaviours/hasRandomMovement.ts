import { text } from "herotext";
import { hasMonsterTurn } from "./hasMonsterTurn";
import { useRng } from "../../engine/useRng";
import { canMove } from "../../mechanics/canMove";
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

export const hasRandomMovement = text`
${hasMonsterTurn()}
${canMove}

turn:~
// Low chance if any other move is more pressing (e.g. attack)
{1%}$move($randomMovementDirection) 

randomMovementDirection:
${VECTOR_ORIGIN}
${VECTOR_N}
${VECTOR_NE}
${VECTOR_E}
${VECTOR_SE}
${VECTOR_S}
${VECTOR_SW}
${VECTOR_W}
${VECTOR_NW}
`;

// < 0, 0>
// < 0, 1>
// < 1, 0>
// < 0,-1>
// <-1, 0>
// < 1, 1>
// <-1,-1>
// <-1, 1>
// < 1,-1>

import { text } from "herotext";
import { vector, Vector } from "herotext";

export type PositionState = { position: Vector };

export const hasPosition = (position = vector(0, 0)) => text`
position:=
${() => position}
`;

// TODO: Some kind of event system, onPositionChanged etc?

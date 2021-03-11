import { text } from "herotext";
import { vector, Vector } from "herotext";

export type PositionState = { position: Vector };

export const hasPosition = (position = vector(0, 0)) => text`
position:=
${() => position}

onPositionChanging:~ ($new)
{0}

onPositionChanged:~ ($old)
{0}

setPosition: ($new)
$void(
  $onPositionChanging($new)
  $oldPosition=$position
  $position=$new
  $onPositionChanged($oldPosition)
)
`;

// TODO: Some kind of event system, onPositionChanged etc?

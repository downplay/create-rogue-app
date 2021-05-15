import { text } from "@hero/text";
import { vector, Vector } from "@hero/text";

export type PositionState = { position: Vector };

export const hasPosition = (position = vector(0, 0)) => text`
setup:+~
$position

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

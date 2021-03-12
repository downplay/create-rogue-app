import { text } from "herotext";
import { stats, hasStats } from "../../mechanics/hasStats";
import { hasTile } from "../../mechanics/hasTile";
import { entity } from "../../engine/entity";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { GridLayers } from "../../engine/grid";

const batStats = stats(2, 1, 1);

export const Bat = entity(text`
[
  ${hasTile("🦇", GridLayers.Actor)}
  ${hasStats(batStats)}
  ${hasRandomMovement};
  //isFlying()
]

Type:
Bat

Describe:
"God Damned Bats"
`);

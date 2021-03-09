import { text, Vector, add } from "herotext";
// import { hasPosition, getPosition } from "./hasPosition";
import { FLAG_SOLID, FLAG_MONSTER, FLAG_PLAYER } from "../engine/flags";
import { hasDeath, getDeath } from "./hasLife";
// import { useCombat } from "./combat";
import { GameState } from "../engine/game";
import { EntityState } from "../engine/entity";

// TODO: Putting all the interactions in `move` seems like the wrong way around; as this
// becomes too unwieldy consider a more extensible way to handle entity interactions. Really
// we should check what's on the tile before we decide to move, and then call the appropriate
// action instead (move, attack, open, etc.) - then different actions would trigger different
// numbers of turns.

// const [isDead] = hasDeath();
// const combat = useCombat();

export const canMove = text`
move: ($delta)
$position=${(
  actor: GameState & EntityState & LifeState & { delta: Vector }
): Vector => {
  const { position, isDead, grid, delta } = actor;
  // TODO: Should never be called in either of these cirumstance
  if (isDead || !position) {
    return position;
  }
  const next = add(position, delta);
  // const cell = grid.getCell(next);
  return next;
}}
`;

// TODO: Reimplement interact and combat

// if (cell.tiles.find((tile) => tile.entity?.getFlag(FLAG_SOLID))) {
//   // TODO: animate bumping wall (how? - need to send some state to tile)
//   return;
// }
// // TODO: needs to become a more sophisticated faction check
// // TODO: and we should really just have a findEntity method on the cell ...
// if (actor.getFlag(FLAG_PLAYER)) {
//   const monsterTile = cell.tiles.find(
//     (tile) => tile.entity?.getFlag(FLAG_MONSTER) && !getDeath(tile.entity)
//   );
//   if (monsterTile) {
//     // IT'S COMBAT TIME
//     combat(monsterTile.entity as EntityContext);
//     return;
//   }
// }
// if (actor.getFlag(FLAG_MONSTER)) {
//   const playerTile = cell.tiles.find(
//     (tile) => tile.entity?.getFlag(FLAG_PLAYER) && !getDeath(tile.entity)
//   );
//   if (playerTile) {
//     // IT'S COMBAT TIME
//     combat(playerTile.entity as EntityContext);
//     return;
//   }
// }

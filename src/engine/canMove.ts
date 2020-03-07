import { Vector, add } from "./vector";
import { hasPosition } from "./hasPosition";
import { useCallback } from "react";
import { useGrid } from "./grid";
import { FLAG_SOLID, FLAG_MONSTER, FLAG_PLAYER } from "./flags";
import { hasDeath, getDeath } from "./hasLife";
import { useCombat } from "./combat";
import { useEntity, EntityContext } from "./useEntitiesState";

export const canMove = () => {
  const [position, setPosition] = hasPosition();
  const grid = useGrid();
  const actor = useEntity();
  const [isDead] = hasDeath();
  const combat = useCombat();

  const move = useCallback(
    (delta: Vector) => {
      if (isDead || position === null) {
        return;
      }
      if (position === undefined) {
        throw new Error("Was not expecting undefined position");
      }
      const next = add(position, delta);
      const cell = grid.getCell(next);
      // TODO: Putting all the interactions in `move` seems like the wrong way around; as this
      // becomes too unwieldy consider a more extensible way to handle entity interactions. Really
      // we should check what's on the tile before we decide to move, and then call the appropriate
      // action instead (move, attack, open, etc.) - then different actions would trigger different
      // numbers of turns.
      if (cell.tiles.find(tile => tile.entity?.getFlag(FLAG_SOLID))) {
        // TODO: animate bumping wall (how? - need to send some state to tile)
        return;
      }
      // TODO: needs to become a more sophisticated faction check
      // TODO: and we should really just have a findEntity method on the cell ...
      if (actor.getFlag(FLAG_PLAYER)) {
        const monsterTile = cell.tiles.find(
          tile => tile.entity?.getFlag(FLAG_MONSTER) && !getDeath(tile.entity)
        );
        if (monsterTile) {
          // IT'S COMBAT TIME
          combat(monsterTile.entity as EntityContext);
          return;
        }
      }
      if (actor.getFlag(FLAG_MONSTER)) {
        const playerTile = cell.tiles.find(
          tile => tile.entity?.getFlag(FLAG_PLAYER) && !getDeath(tile.entity)
        );
        if (playerTile) {
          // IT'S COMBAT TIME
          combat(playerTile.entity as EntityContext);
          return;
        }
      }
      setPosition(next);
    },
    [setPosition]
  );

  return [move];
};

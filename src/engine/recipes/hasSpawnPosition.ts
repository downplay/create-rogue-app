import { useEffect } from "react";
import { hasPosition } from "../../engine/hasPosition";
import { useGrid, useGridState } from "../../engine/grid";
import { useRng } from "../../engine/useRng";
import { FLAG_SOLID, FLAG_SPAWN_POSITION } from "../../engine/flags";

export const hasSpawnPosition = () => {
  const [position, setPosition] = hasPosition(null);
  const grid = useGrid();
  // TODO: Very very bad for performance, should register for an event, maybe use turn 0
  //       to do the spawn?
  const gridState = useGridState();
  const random = useRng();

  useEffect(() => {
    if (position) {
      return;
    }
    const tiles = grid.findTiles((tile, cell) => {
      return (
        tile.entity?.getFlag(FLAG_SPAWN_POSITION) &&
        !cell.tiles.find(otherTile => otherTile.entity?.getFlag(FLAG_SOLID))
      );
    });
    if (tiles.length) {
      const chosen = random.pick(tiles);
      setPosition(chosen.position);
    }
  }, [gridState]);
};

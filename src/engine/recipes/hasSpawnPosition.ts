import { useEffect } from "react";
import { hasPosition } from "../../engine/hasPosition";
import { useGrid, useGridState } from "../../engine/grid";
import { useRng } from "../../engine/useRng";
import { SOLID_FLAG, SPAWN_POSITION_FLAG } from "../../engine/flags";

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
        tile.entity?.getFlag(SPAWN_POSITION_FLAG) &&
        !cell.tiles.find(otherTile => otherTile.entity?.getFlag(SOLID_FLAG))
      );
    });
    if (tiles.length) {
      const chosen = random.pick(tiles);
      setPosition(chosen.position);
    }
  }, [gridState]);
};

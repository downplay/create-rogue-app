import { useEffect } from "react";
import { hasPosition } from "../../engine/hasPosition";
import { useGrid, useGridState } from "../../engine/grid";
import { useRng } from "../../engine/useRng";
import { FLAG_SOLID, FLAG_SPAWN } from "../../engine/flags";

export const useFindPosition = (flag: symbol = FLAG_SPAWN) => {
  const grid = useGrid();
  const rng = useRng();
  return () => {
    const tiles = grid.findTiles((tile, cell) => {
      return (
        tile.entity?.getFlag(flag) &&
        !cell.tiles.find(otherTile => otherTile.entity?.getFlag(FLAG_SOLID))
      );
    });
    if (tiles.length) {
      const chosen = rng.pick(tiles);
      return chosen.position;
    }
  };
};

export const hasSpawnPosition = (flag: symbol = FLAG_SPAWN) => {
  const [position, setPosition] = hasPosition(null);
  const grid = useGrid();
  // TODO: Very very bad for performance, should register for an event, maybe use turn 0
  //       to do the spawn?
  const gridState = useGridState();
  const rng = useRng();

  useEffect(() => {
    if (position) {
      return;
    }
    const tiles = grid.findTiles((tile, cell) => {
      return (
        tile.entity?.getFlag(flag) &&
        !cell.tiles.find(otherTile => otherTile.entity?.getFlag(FLAG_SOLID))
      );
    });
    if (tiles.length) {
      const chosen = rng.pick(tiles);
      setPosition(chosen.position);
    }
  }, [gridState]);
};

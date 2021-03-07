import { FLAG_SOLID, FLAG_SPAWN } from "../../engine/flags";
import { text } from "herotext";
import { PositionState } from "../../mechanics/hasPosition";
import { GameState } from "../../engine/game";

// export const useFindPosition = (flag: symbol = FLAG_SPAWN) => {
//   const grid = useGrid();
//   const rng = useRng();
//   return () => {
//     const tiles = grid.findTiles((tile, cell) => {
//       return (
//         tile.entity?.getFlag(flag) &&
//         !cell.tiles.find((otherTile) => otherTile.entity?.getFlag(FLAG_SOLID))
//       );
//     });
//     if (tiles.length) {
//       const chosen = rng.pick(tiles);
//       return chosen.position;
//     }
//   };
// };

export const hasSpawnFlag = (flag = FLAG_SPAWN) => text<
  GameState & PositionState
>`
setup:~
$position=${({ grid, position }, { rng }) => {
  const tiles = grid.findTiles(
    (tile, cell) =>
      tile.entity?.getFlag(flag) &&
      !cell.tiles.find((otherTile) => otherTile.entity?.getFlag(FLAG_SOLID))
  );
  if (tiles.length) {
    const chosen = rng.pick(tiles);
    return chosen.position;
  }
  return position;
}}
`;

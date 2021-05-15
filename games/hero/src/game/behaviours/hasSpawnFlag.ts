import { text, StoryInstance } from "@hero/text";
import { PositionState } from "../../mechanics/hasPosition";
// import { GameState } from "../../engine/game";
import { EngineState } from "../../engine/types";
import {
  entityHasFlag,
  FlagsState,
  FLAG_SOLID,
  FLAG_SPAWN,
} from "../../engine/flags";

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
  EngineState & PositionState
>`
setup:+~
$position=${({ engine, position }, { rng }) => {
  const tiles = engine.map.findTiles(
    (tile, cell) =>
      entityHasFlag(tile.entity, flag) &&
      !cell.tiles.find((otherTile) => entityHasFlag(otherTile.entity, flag))
  );
  if (tiles.length) {
    const chosen = rng.pick(tiles);
    return chosen[1].position;
  }
  return position;
}}
`;

import { hasPosition } from "../engine/hasPosition";
import { ORIGIN } from "../engine/vector";
import { hasTile, tile } from "../engine/hasTile";
import { entity } from "../engine/entity";

const PlayerTile = tile("😃");

export const Player = entity(() => {
  hasPosition(ORIGIN);
  hasTile(PlayerTile);
  return null;
});

import React, { useMemo, memo } from "react";
import { reduceQuad, vector, vectorKey } from "../../../math/vector";
import { Floor } from "../../levels/Floor";
import { useRng } from "../../../engine/useRng";
import { Ascii } from "../../../ui/Typography";
import { GrassTile } from "./GrassLand";
import { Flag, FLAG_PLAYER_SPAWN, PlayerSpawn } from "../../../engine/flags";

export const FLAG_ROADSIDE = Symbol("RoadsideFlag");

const variants = ["o", "8", "O", "c", "0", ".", "", ""];

const colors = [
  "#776A2A",
  "#766227",
  "#735A24",
  "#705223",
  "#6D4A22",
  "#684321",
];

export const RoadTile = () => {
  const rng = useRng();

  const [variant, bg, fg] = useMemo(
    () => [rng.pick(variants), rng.pick(colors), rng.pick(colors)],
    []
  );

  return (
    <Ascii fore={fg} back={bg}>
      {fg === bg ? "" : variant}
    </Ascii>
  );
};

export const RoadLayout = memo(() => {
  const rng = useRng();
  const roadWidth = useMemo(() => rng.integer(5, 8), []);
  const bottomPos = Math.floor(40 - roadWidth / 2);
  const topPos = Math.floor(40 + roadWidth / 2);
  return (
    <>
      {reduceQuad(vector(20, 20), vector(60, 60), (position) => {
        const key = vectorKey(position);
        if (
          position.y >= bottomPos &&
          position.y <= topPos &&
          position.x > 30 &&
          position.y < 50
        ) {
          return (
            <Floor key={key} TileComponent={RoadTile} position={position}>
              {position.x === 55 ? <PlayerSpawn /> : null}
            </Floor>
          );
        }

        return (
          <Floor key={key} TileComponent={GrassTile} position={position}>
            {position.y === bottomPos - 1 ? <Flag on={FLAG_ROADSIDE} /> : null}
          </Floor>
        );
      })}
    </>
  );
});

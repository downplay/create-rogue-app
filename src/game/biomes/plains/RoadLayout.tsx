import React, { useMemo, memo } from "react";
import { reduceQuad, vector } from "../../../engine/vector";
import { Floor } from "../../levels/Floor";
import { useRng } from "../../../engine/useRng";
import { Ascii } from "../../../ui/Typography";
import { GrassTile } from "./GrassLand";
import { Flag } from "../../../engine/flags";

export const FLAG_ROADSIDE = Symbol("RoadsideFlag");

const variants = ["o", "8", "O", "c", "0", ".", "", ""];

const colors = [
  "#776A2A",
  "#766227",
  "#735A24",
  "#705223",
  "#6D4A22",
  "#684321"
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
      {reduceQuad(vector(20, 20), vector(60, 60), position => {
        if (position.y >= bottomPos && position.y <= topPos) {
          return <Floor TileComponent={RoadTile} position={position} />;
        }

        return (
          <Floor TileComponent={GrassTile} position={position}>
            {position.y === bottomPos - 1 ? <Flag on={FLAG_ROADSIDE} /> : null}
          </Floor>
        );
      })}
    </>
  );
});

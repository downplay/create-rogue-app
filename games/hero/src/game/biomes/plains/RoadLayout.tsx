import React, { useMemo } from "react";
import { useRng } from "../../../engine/useRng";
import { Ascii } from "../../../ui/Typography";
import { FLAG_PLAYER_SPAWN } from "../../../engine/flags";
import { map } from "../../../../../../packages/heromap/src/parse";

export const FLAG_ROADSIDE = "RoadsideFlag";

const variants = ["o", "8", "O", "c", "0", ".", "", ""];

const colors = [
  "#776A2A",
  "#766227",
  "#735A24",
  "#705223",
  "#6D4A22",
  "#684321",
];

const road = map`
........................................
........................................
........................................
........................................
........................................
........................................
........................................
----------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
=====================================@==
=====================================@==
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
----------------------------------------
........................................
........................................
........................................
........................................
........................................
........................................
........................................

- = [.~]
~ = [.=]
. = Floor
[=@] = Road
@ = flag(${FLAG_PLAYER_SPAWN})
outline([=@]) = flag(${FLAG_ROADSIDE})
`;

// TODO: Maybe apply flags positionally like:
// <0,18..20>...<40,21..23> = Road
// <width-3,*>:Road = flag(PLAYER_SPAWN)

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

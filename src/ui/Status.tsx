import React from "react";
import { Line } from "./Typography";
import { usePlayer } from "../engine/player";
import { getStats, Stats } from "../engine/hasStats";

export const Status = () => {
  const player = usePlayer();
  console.log(player);
  const stats =
    (player.current?.state && getStats(player.current)) || ({} as Stats);

  return (
    <>
      <Line>Str: {stats.str}</Line>
      <Line>Dex: {stats.dex}</Line>
      <Line>Int: {stats.int}</Line>
    </>
  );
};

import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster, Name, Description } from "../../ui/cards/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";

const ratStats = stats(2, 1, 3, 0, 10);

const RatTile = tile("🐀");

export const Rat = entity(() => {
  hasTile(RatTile);

  const stats = hasStats(ratStats);

  return (
    <Monster>
      <Name>
        <RatTile />
        Rat
      </Name>
      <Description>A smelly, </Description>
    </Monster>
  );
});

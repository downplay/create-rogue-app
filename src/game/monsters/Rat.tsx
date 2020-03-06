import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster, Name, Description, Card } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";

const ratStats = stats(2, 1, 3, 0, 10);

const RatTile = tile("🐀");

export const Rat = entity(() => {
  hasTile(RatTile, GridLayers.Actor);

  const stats = hasStats(ratStats);

  return (
    <Monster>
      <Card>
        <Name>
          <RatTile />
          Rat
        </Name>
        <Description>A smelly, mangy rodent</Description>
      </Card>
    </Monster>
  );
});

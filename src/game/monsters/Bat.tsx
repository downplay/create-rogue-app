import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";

const batStats = stats(2, 1, 5, 1, 24);

const BatTile = tile("🦇");

export const Bat = entity(() => {
  hasTile(BatTile, GridLayers.Actor);
  hasStats(batStats);

  hasRandomMovement();
  //isFlying()

  return (
    <Monster>
      <Card>
        <Name>Bat</Name>
        <Description>
          <BatTile /> "God Damned Bats"
        </Description>
      </Card>
    </Monster>
  );
});

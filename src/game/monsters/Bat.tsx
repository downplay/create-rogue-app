import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster, Name, Description } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Card } from "../../ui/Card";

const batStats = stats(2, 1, 5, 1, 24);

const BatTile = tile("🦇");

export const Bat = entity(() => {
  hasTile(BatTile, GridLayers.Actor);

  const stats = hasStats(batStats);

  hasRandomMovement();
  //isFlying()

  return (
    <Monster>
      <Card>
        <Name>
          <BatTile />
          Bat
        </Name>
        <Description>Goddamned bats</Description>
      </Card>
    </Monster>
  );
});

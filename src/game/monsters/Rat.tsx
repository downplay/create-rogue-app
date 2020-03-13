import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";
import { Emoji } from "../../ui/Typography";

const ratStats = stats(2, 1, 3, 0, 12);

const RatTile = () => <Emoji>🐀</Emoji>;

export const Rat = entity(() => {
  hasTile(RatTile, GridLayers.Actor);
  hasStats(ratStats);
  hasRandomMovement();

  return (
    <Monster>
      <Card>
        <Name>Rat</Name>
        <Description>
          <RatTile /> A smelly, mangy rodent
        </Description>
      </Card>
    </Monster>
  );
});

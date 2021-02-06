import React from "react";
import { hasTile } from "../../engine/hasTile";
import { Monster } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";
import { Emoji } from "../../ui/Typography";
import { commonFunctions } from "../../engine/text/commonFunctions";
import { useStory } from "../../engine/useStory";
import { text } from "../../engine/text/parse";

const ratStats = stats(2, 1, 3, 0, 12);

const RatTile = () => <Emoji>🐀</Emoji>;

const ratStory = text`
$null(
  %size = $randomRange()
)

description:
A mangy and foul smelling $size rodent

size:=
[0.5]small
[1]medium
[2]large
[4]unusually massive

${commonFunctions}
`;

export const Rat = entity(() => {
  hasTile(RatTile, GridLayers.Actor);
  hasStats(ratStats);
  hasRandomMovement();
  const result = useStory(ratStory);

  return (
    <Monster>
      <Card>
        <Name>Rat</Name>
        <Description>
          <RatTile /> {result.renderLabel("description")}
        </Description>
      </Card>
    </Monster>
  );
});

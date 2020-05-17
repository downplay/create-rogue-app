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
import { text } from "../../engine/text/parse";

/* react-custom-renderer */

const ratStats = stats(6, 4, 5, 1, 10);

const DogTile = () => <Emoji>🐕</Emoji>;

const nameText = text`
$one$two

one:
Ro
Fi
Ri
La
Ca

two:
ver
do
ssie
stro
zlo
zla
`;

const descriptionText = text`
$title($a({nouny} {verb}))

nouny:
mangy
contented
fuzzy
fluffy
dopey

verb:
pooch
$(gender=male)good boy
$(gender=female)good girl
mutt
pup
`;

export const Dog = entity(() => {
  hasTile(DogTile, GridLayers.Actor);
  hasStats(ratStats);
  hasRandomMovement();

  return (
    <>
      <Name>Dog</Name>
      <Card>
        <Description>
          <DogTile /> ${description}
        </Description>
      </Card>
    </>
  );
});

export const Dog = commonActor({
  name: "Dog",
  tile: "🐕",
  description,
  stats: stats(6, 4, 5, 1, 10),
});

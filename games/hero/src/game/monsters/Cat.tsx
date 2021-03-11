import { entity } from "../../engine/entity";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Emoji } from "../../ui/Typography";
import { text } from "herotext";
import { hasStats, stats } from "../../mechanics/hasStats";
import { hasTile } from "../../mechanics/hasTile";

const catStats = stats(6, 4, 5);

const CatTile = () => <Emoji>🐕</Emoji>;

export const Cat = entity(text`
Name:=
$catName

Describe:=
$title($a($nouny $verb))

${hasTile(CatTile, GridLayers.Actor)}
${hasStats(catStats)}
${hasRandomMovement}

nouny:
mangy
contented
fuzzy
fluffy
dopey

verb:
pooch
$(gender=male)good kittt
$(gender=female)good girl
mutt
pup

dogName:=
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
`);

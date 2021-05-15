import { entity } from "../../engine/entity";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Emoji } from "../../ui/Typography";
import { text } from "@hero/text";
import { hasStats, stats } from "../../mechanics/hasStats";
import { hasTile } from "../../mechanics/hasTile";

const dogStats = stats(6, 4, 5);

const DogTile = () => <Emoji>🐕</Emoji>;

export const Dog = entity(text`
Type:
Dog

Name:=
$dogName

Describe:=
$title($a($nouny $verb))

${hasTile(DogTile, GridLayers.Actor)}
${hasStats(dogStats)}
${hasRandomMovement}

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

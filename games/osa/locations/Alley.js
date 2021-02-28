import { text } from "herotext";
import { LOCATION_ALLEY } from "./locationNames";

export const Alley = text`
Name:
${LOCATION_ALLEY}

LongDescription:
You find yourself in a dark and dingy alleyway in the bad part of town. [{$player.name==Disco}An alleyway
you are very much accustomed to calling "home".]

ShortDescription:
A dark, (smelly|dank|filthy) alleyway.

LOOK WEST:
To the West you hear the familiar bustle of the High Street.

GO WEST:
$goto(HighStreetSouth)

GO EAST:
{$clock<6,$clock>20}[In the pitch darkness you stumble over a dustbin, its lid clattering on the ground and rubbish spewing everywhere.
A cat hisses. You decide not to attempt to negotiate the alleyway in this light.$[rubbish pile]=true]
{0%}$goto(BackLot)

`;

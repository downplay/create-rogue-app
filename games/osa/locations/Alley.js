import { text } from "../../../src/engine/text/parse";
import { goTo } from "../commands/goTo";
import { HighStreetSouth } from "./HighStreetSouth";

export const Alley = text`You find yourself in a dark and dingy alleyway in the bad part of town. [{$player.name==Disco}An alleyway
you are very much accustomed to calling "home".]

description:
{$clock<6,$clock>20}
{0}

look west:
To the West you hear the familiar bustle of the High Street.

look east:
{$clock<6,$clock>20}
{}

go west:
${goTo(HighStreetSouth)}

go east:
{$clock<6,$clock>20}[In the pitch darkness you stumble over a dustbin, its lid clattering on the ground and rubbish spewing everywhere.
A cat hisses. You decide not to attempt to negotiate the alleyway in this light.$[rubbish pile]=true]
{0%}${goTo(BackLot)}

`;

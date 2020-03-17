import { text } from "../../../engine/text/parse";

export const tavernNameText = text`
$YeOldePubbe
$DuckAndWaffle
$KingsArms

YeOldePubbe:
$ye $adjective $pub

DuckAndWaffle:
$ye $sillyThing $and $sillyThing

KingsArms:
$ye $importantPerson's $limb

ye:
Ye
The

adjective:
Olde
Anschiente
Magick
Crumbly
Thingie
Broken
Unfortunate
Lonely

pub:
Pubbe
Drink-hole
Tavern
House
Shack
Hovel

and:
And
&
+

sillyThing:
Dog
Bone
Ladder
Snake
Spade
Fork
Duck
Waffle
Biscuit
Bells
Grommit
Banker
Sparrow
Shine
Sun
Stars
Moon

importantPerson:
King
Queen
Ace
Lord

limb:
Arm$s
Leg$s
Head$s
Hand$s
Knee$s
(Feet|Foot)
Nose
Ear$s

s:
s
!
`;

const wait = (n: number) => "WAIT:" + n;

export const tavernInteriorDescription = text`
(You stoop into the murky atmosphere. "$tavernName" might just be the grubbiest pub you've ever seen.
Someone eyes you shiftily from the other side of the room. In the corner, the piano stops.
${wait(2)}
$Scene)

Scene:
$Brawl
$Rest
$Abandoned

Brawl:
(A patron spits on the floor. "You ain't from around 'ere," they grunt.
Before you can reply, another drunk jeers, "Aye that's rich, comin' from a $(slur=XenophobicSlur)!"
"'Oo you callin' a $slur?" replies the first. The second hurls their glass in response. Before you know it, the entire bar is embroiled in an out-of-control brawl!
)

XenophobicSlur:
Southern Florist
Midlandser
Northern Gridmonkey
Fairy Islander
`;

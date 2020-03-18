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
$ye $vip's $limb

ye:
Ye
The
One
!

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
Hall$s
Stable$s
Castle
Manse

and:
And
&
+
'n'

sillyThing:
Doggo
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
Fish
Chips

vip:
King
Queen
Ace
Lord
Duke
Duchess
God
Knight
Traveller
Had

limb:
Arm$s
Leg$s
Head$s
Hand$s
Knee$s
(Feet|Foot)
Nose
Ear$s
Bowel$s
Heart
Eye$s
Nostril$s
Wing$s

s:
s
!
`;

const wait = (n: number) => "WAIT:" + n;

// $Rest
// $Abandoned

export const tavernInteriorDescription = text`
(You stoop into the murky atmosphere. "$tavernName" might just be the grubbiest pub you've ever seen...
${wait(2)}
$Scene)

Scene:
$Brawl
$Abandoned

Brawl:
(...Someone eyes you shiftily from the other side of the room. In the corner, the piano stops.
A patron spits on the floor. "You ain't from around 'ere," they grunt.
Before you can reply, another drunk jeers, "Aye that's rich, comin' from a $(slur=XenophobicSlur)!"
"'Oo you callin' a $slur?" replies the first. The second hurls their glass in response. Before you know it, the entire bar is embroiled in an out-of-control brawl!
)

Abandoned:
(...But it's completely deserted! A shiver runs down your spine. Half-drained ale flagons are dotted around the hall.)

XenophobicSlur:
Southern Florist
Midlandser
Northern Gridmonkey
Fairy Islander
`;

export const patronBanter = text`
Oi oi!
What ho!
Howdy
¡Hola!
Pardon...
Cheers!
`;

import { text } from "herotext";
import { interior1 } from "./maps";
import { wait } from "../../../executors/wait";

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
[Feet|Foot]
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

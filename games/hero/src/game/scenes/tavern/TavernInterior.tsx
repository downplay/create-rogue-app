import { text } from "herotext";
import { wait } from "../../../executors/wait";
import { interior1 } from "./maps";

export const TavernInterior = text`
[You stoop into the murky atmosphere. "$tavernName" might just be the grubbiest pub you've ever seen...
${wait(2)}
$grid(${interior1})
$Scene]

Scene:
$Brawl
$Abandoned

Brawl:
[...Someone eyes you shiftily from the other side of the room. In the corner, the piano stops.
A patron spits on the floor. "You ain't from around 'ere," they grunt.
Before you can reply, another drunk jeers, "Aye that's rich, comin' from a $XenophobicSlur!"
"'Oo you callin' a $slur?" replies the first. The second hurls their glass in response. Before you know it, the entire bar is embroiled in an out-of-control brawl!
]

Abandoned:
[...But it's completely deserted! A shiver runs down your spine. Half-drained ale flagons are dotted around the hall.]

XenophobicSlur:=
Southern Florist
Midlandser
Northern Gridmonkey
Fairy Islander
`;

import { text } from "herotext";
import { map } from "heromap";
import { FLAG_PLAYER_SPAWN } from "../../../engine/flags";
import { entity } from "../../../engine/entity";

export const FLAG_ROADSIDE = "RoadsideFlag";

export const RoadLayout = map`
........................................
........................................
........................................
........................................
........................................
........................................
........................................
----------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
=====================================@==
=====================================@==
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
----------------------------------------
........................................
........................................
........................................
........................................
........................................
........................................
........................................

- = [.~]
~ = [.=]
. = Floor
[=@] = Road
@ = flag(${FLAG_PLAYER_SPAWN})
outline([=@]) = flag(${FLAG_ROADSIDE})
`;

// TODO: Maybe apply flags positionally like:
// <0,18..20>...<40,21..23> = Road
// <width-3,*>:Road = flag(PLAYER_SPAWN)

export const Road = entity(text`
Type:
Floor

Tile:=
// TODO: 
[$fore=$TileColors][$back=$TileColors][o|8|O|c|0|{20%}.|{20%}']

TileColors:
#776A2A
#766227
#735A24
#705223
#6D4A22
#684321

Describe:=
$adjective $noun.

adjective:
[Dusty|Hard|Rocky|Well-[trodden|worn]]

noun:
[path|track|carriageway]
`);

// TODO: Would be nice sometimes in situtations like above to create a first instance to
// set the description permanently, then clone additional instances using its state
// so all the tiles have the same descrption

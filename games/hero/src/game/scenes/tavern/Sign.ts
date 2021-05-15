import { text } from "@hero/text";
import { tavernNameText } from "./text";
import { entity } from "../../../engine/entity";

/**
 * Tavern sign: should probably be repurposed as a general sign with a prop for text
 */
export const Sign = entity(text`
Type:
Sign

Tile:
🚧

tavernName:=
${tavernNameText}

onInteract:
[The sign reads:

*$tavernName* welcomes
    careful drunks

Menu
- Beer 🍺
- Wine 🏺
- Bears! 🐻

🕘 Happy Hour! 😁
All day long!!
]

Description:
🚧 "$tavernName"

Something else is written on it, but you can't make it out from here.
`);

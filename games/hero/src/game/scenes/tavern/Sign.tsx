import { text } from "herotext";
import { Emoji } from "../../../ui/Typography";
import { tavernNameText } from "./text";
import { entity } from "../../../engine/entity";
import { hasPosition } from "../../../mechanics/hasPosition";
import { hasTile } from "../../../mechanics/hasTile";

const SignTile = () => <Emoji>🚧</Emoji>;

/**
 * Tavern sign: should probably be repurposed as a general sign with a prop for text
 */
export const Sign = entity(text`
Type:
Sign

${hasPosition()}
${hasTile(SignTile)}

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

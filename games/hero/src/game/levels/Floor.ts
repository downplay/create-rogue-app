// import { Ascii } from "../../ui/Typography";
// import { isSpawn } from "../../engine/flags";
import { text } from "@hero/text";
import { entity } from "../../engine/entity";

// const SLATE_1 = "#49394E";
// const SLATE_2 = "#59506C";

// export const FloorTile = () => (
//   <Ascii fore={SLATE_1} back={SLATE_2}>
//     ▞
//   </Ascii>
// );

// ${isSpawn}

export const Floor = entity(text`
Type:
Floor

Tile:=
▞

Description:
$adjective dungeon floor.

adjective:=
[Dusty|Grimy|Dirty]
`);

// import { Ascii } from "../../ui/Typography";
import { text } from "@hero/text";
import { entity } from "../../engine/entity";
import { isSolid } from "../../engine/flags";

// const BRICK_RED = "#4E2B1A";
// const BRICK_YELLOW = "#715323";

// export const WallTile = () => (
//   <Ascii fore={BRICK_RED} back={BRICK_YELLOW}>
//     ▓
//   </Ascii>
// );

// TODO: implement colour for tiles. And/or just allow react components.

export const Wall = entity(text`
${isSolid}

Type:
Wall

Tile:
▓

Describe:
Just another wall in the grid.
`);

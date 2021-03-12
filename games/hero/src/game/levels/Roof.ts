import { text } from "herotext";
import { entity } from "../../engine/entity";
import { isSolid } from "../../engine/flags";

// const BRICK_RED = "#4E2B1A";
// const BRICK_YELLOW = "#715323";

// export const RoofTile = () => (
//   <Ascii fore={BRICK_YELLOW} back={BRICK_RED}>
//     U
//   </Ascii>
// );

export const Roof = entity(text`
${isSolid}

Type:
Roof

Tile:
U

Describe:
Its name is Rufus.
`);

import { text } from "herotext";
import { LOCATION_PIESHOP } from "./locationNames";

export const PieShop = text`
LongDescription:
[You follow your nose through the door of "Pie Are Squared". An industrial oven hums, pies gently
browning inside. A jolly gray-haired lady stands smiling behind the counter.]

ShortDescription:
"Pie Are Squared" - home of the square pie.

GO WEST:
$goto(${LOCATION_PIESHOP})
`;

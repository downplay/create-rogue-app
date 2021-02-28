import { text } from "herotext";
import { LOCATION_HIGHSTREETMID } from "./locationNames";

export const HighStreetMid = text`
Name:
${LOCATION_HIGHSTREETMID}

LongDescription:
[You are about half-way up the High St. From a door to the East wafts
the delicious smell of the Pie Shop.
To the West is the bank. The street runs North and South.]

ShortDescription:
{0}The middle of the High St.

GO NORTH:
$goto(HighStreetNorth)

GO SOUTH:
$goto(HighStreetSouth)

GO WEST:
$goto(Bank)

GO EAST:
$goto(PieShop)
`;

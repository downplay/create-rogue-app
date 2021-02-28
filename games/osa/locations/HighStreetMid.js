import { text } from "herotext";

export const HighStreetMid = text`[You are about half-way up the High St. From a door to the East wafts
the delicious smell of the Pie Shop.
To the West is the bank. The street runs North and South.]
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

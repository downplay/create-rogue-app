import { text } from "herotext";
import { LOCATION_HIGHSTREETNORTH } from "./locationNames";

export const HighStreetNorth = text`
Name:
${LOCATION_HIGHSTREETNORTH}

LongDescription:
[You are at the top end of the High Street, where it opens out into a large square. Water flows from a large fountain in
the center of the square. To the North are the grand steps leading up to the Town Hall; either side a statue of some
obscure mythical creature is posed.
On the West side of the square you see a trendy vintage clothing store. Next to the door sits a beggar. On the East side
of the square is the enormous pub, The Withered Spoon.
The High Street stretches off to the South.]

ShortDescription:
North end of the High St.

GO NORTH:
The Town Hall is currently closed to visitors.

GO SOUTH:
$goto(HighStreetMid)

GO WEST:
The shop is closed.

GO EAST:
$goto(Bar)

`;

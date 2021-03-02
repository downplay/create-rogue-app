import { text } from "herotext";
import {
  LOCATION_BANK,
  LOCATION_HIGHSTREETMID,
  LOCATION_HIGHSTREETNORTH,
  LOCATION_HIGHSTREETSOUTH,
  LOCATION_PIESHOP,
} from "./locationNames";

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
$goto(${LOCATION_HIGHSTREETNORTH})

GO SOUTH:
$goto(${LOCATION_HIGHSTREETSOUTH})

GO WEST:
$goto(${LOCATION_BANK})

GO EAST:
$goto(${LOCATION_PIESHOP})
`;

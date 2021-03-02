import { text } from "herotext";
import {
  LOCATION_ALLEY,
  LOCATION_HIGHSTREETNORTH,
  LOCATION_HIGHSTREETSOUTH,
} from "./locationNames";

export const HighStreetSouth = text`
Name:
${LOCATION_HIGHSTREETSOUTH}

LongDescription:
[You are at the bottom end of the High St. To the East is a dark, narrow alleyway.
West is a boarded-up shop, its signage faded. To the South is a high brick wall. The street runs North.]

ShortDescription:
The bottom end of the High St.

GO NORTH:
$goto(${LOCATION_HIGHSTREETNORTH})

GO EAST:
$goto(${LOCATION_ALLEY})

GO SOUTH:
The wall is too high.

GO WEST:
The shop is very securely sealed. Metal barriers are bolted over all the windows.
`;

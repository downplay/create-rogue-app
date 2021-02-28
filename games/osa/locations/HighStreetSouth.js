import { text } from "herotext";

export const HighStreetSouth = text`[You are at the bottom end of the High St. To the East is a dark, narrow alleyway.
West is a boarded-up shop, its signage faded. To the South is a high brick wall. The street runs North.]
{0}The bottom end of the High St.

go north:
$goto(HighStreetMid)

go south:
The wall is too high.

go west:
The shop is very securely sealed. Metal barriers are bolted over all the windows.
`;

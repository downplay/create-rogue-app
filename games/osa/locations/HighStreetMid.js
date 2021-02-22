import { text } from "../../../src/engine/text/parse";
import { goTo } from "../commands/goTo";

export const HighStreetMid = text`[You are about half-way up the High St. To the East is the pie shop.
To the West is the bank. The street runs North and South.]
{0}The middle of the High St.

go north:
${goTo(HighStreetNorth)}

go south:
${goTo(HighStreetSouth)}

go west:
${goTo(Bank)}

go east:
${goTo(PieShop)}
`;

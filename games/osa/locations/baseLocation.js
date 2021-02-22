import { text } from "../../../src/engine/text/parse";

export const baseLocation = text`You are in a buggy place.
{0%}Buggy place.

Name:
Bugged

Description:
{!$visited}$LongDescription[$visited=true]
{0%}$ShortDescription

LongDescription:
You are in a very buggy place.

ShortDescription:
Buggy place.

DirectionUnavailable:
You cannot go that way.
There is no exit there.
You think about going there, but you realise it's not possible.

LOOK:
$LongDescription

GO NORTH:
$DirectionUnavailable

GO SOUTH:
$DirectionUnavailable

GO WEST:
$DirectionUnavailable

GO EAST:
$DirectionUnavailable
`;

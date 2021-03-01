import { text } from "herotext";

export const baseLocation = text`
{$visitedBefore!=true}$LongDescription[$visitedBefore=true]
{$visitedBefore=true}$ShortDescription

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

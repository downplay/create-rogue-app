import { text } from "@hero/text";

// TODO: Support truthy clauses...
// {!$visited}$LongDescription[$visited=true]
// {0%}$ShortDescription

export const baseLocation = text`
$Description

Name:
Bugged

Description:
{$visitedBefore!=true}$LongDescription$null($visitedBefore=true)
{$visitedBefore==true}$ShortDescription

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

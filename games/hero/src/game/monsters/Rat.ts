import { text } from "herotext";
import { hasStats } from "../../mechanics/hasStats";
import { monster } from "./baseMonster";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";

// TODO: Not supported yet stuff...
/*

size:=
{10%}<0.5..1.0>
{40%}<1.0..2.0>
{10%}<2.0..4.0>
{1%}<4.0..5.0>
*/

const ratTile = `
........
.#####..
......#.
.......#
......#.
..##...#
.####..#
#######.
`;

export const ratStory = text`

${hasStats({ body: 3, mind: 1, spirit: 0 })}

Name:
rat

Tile:
🐀

setup:
$null($size)

size:=
{10%}<0.5>
{40%}<1.0>
{10%}<2.0>
{1%}<4.0>

DescribeLook:
A mangy and foul smelling $DescribeSize rodent

DescribeSize:
[~0.5]small
[~1]medium
[~2]large
[~4]unusually massive
`;

export const Rat = monster(hasRandomMovement, ratStory);

import React from "react";
import { text, commonFunctions } from "herotext";
import { hasTile } from "../../engine/hasTile";
import { Monster } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { hasRandomMovement } from "../behaviours/hasRandomMovement";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";
import { useStory } from "../../engine/useStory";

const ratStats = stats(2, 1, 3, 0, 12);

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

const ratStory = text`
name:
rat

tile:
🐀

setup:
$size = <0.5..5.0>

hp:=


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

export const Rat = monster(randomMovement, ratStory);

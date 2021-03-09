import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { Item } from "../meta/Item";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";
import { text } from "../../engine/text/parse";

type SwordState = {};

export const SwordTile = tile("†");

export const Sword = text`
You see $a($name).

${hasTile(SwordTile, GridLayers.Item)}

Name:
$material $blade

Description:
A $size $class $material $blade.

blade:=
sword
rapier

class:=

toughness:=
10

material:=
[]wooden
[]bronze
[]iron
[]steel
[]diamond$null(%toughness=100)
[]glass
[=gold]golden

size:=
[1%,~0.01]tiny
[10%,~0.1]small
[50%,~1]
[10%,~10]large
[1%,~100]massive
`;

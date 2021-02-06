import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Item } from "../meta/Item";
import { Card, Description } from "../../ui/Card";
import { Name } from "../meta/Name";
import { useStory } from "../../engine/useStory";
import { text } from "../../engine/text/parse";
import { useText } from "../../engine/useText";

type SwordProps = {};

export const SwordTile = tile("†");

const descriptionText = text`
You see $a($name).

name:
$material $blade

description:
A $size $class $material $blade.

blade:=
sword
rapier

class:=


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

export const Sword = ({}: SwordProps) => {
  hasTile(SwordTile, GridLayers.Item);
  const {state: {toughness}} = useStory(descriptionText);
  const description = useText;
  return (
    <Item>
      <Card>
        <Name>{name}</Name>
        <Description>
          <SwordTile /> {description}
        </Description>
      </Card>
    </Item>
  );
};

import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Item } from "../meta/Item";
import { Card, Description } from "../../ui/Card";
import { useTerminal } from "../../engine/terminal";
import { Name } from "../meta/Name";
import { useStory } from '../../engine/useStory';
import { text } from '../../engine/text/parse';

type SwordProps = {  };

export const SwordTile = tile("†");

const descriptionText = text`
A $size $class $material $blade.

blade:
sword

class:

material:
[]wooden
[]bronze
[]iron
[]steel
[]diamond
[]glass
[=gold]golden

size
[1%,=0.01]tiny
[10%,=0.1]small
[50%,=1]
[10%,=10]large
[1%,=100]massive
`

export const Sword = ({  }: SwordProps) => {
  hasTile(SwordTile, GridLayers.Item);
  const description = useStory(()=>)
  return (
    <Item>
      <Card>
        <Name>{`${amount}GP`}</Name>
        <Description>s
          <SwordTile /> {description}
        </Description>
      </Card>
    </Item>
  );
};

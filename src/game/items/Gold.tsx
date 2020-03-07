import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Item } from "../meta/Item";
import { Name, Description } from "../meta/Monster";
import { Card } from "../../ui/Card";

type GoldProps = { amount: number };

export const GoldTile = tile("💰");

export const Gold = ({ amount }: GoldProps) => {
  hasTile(GoldTile, GridLayers.Item);
  onTake(inventory => (inventory.gold += amount));
  return (
    <Item>
      <Card>
        <Name>
          <GoldTile />
          {amount}GP
        </Name>
        <Description>Shiny, shiny gold</Description>
      </Card>
    </Item>
  );
};

import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Card } from "../meta/Monster";
import { Item } from "../meta/Item";

type GoldProps = { amount: number };

export const GoldTile = tile("💰");

export const Gold = ({ amount }: GoldProps) => {
  hasTile(GoldTile, GridLayers.Item);
  onTake(inventory => (inventory.gold += amount));
  return (
    <Item>
      <Card>Shiny, shiny gold</Card>
    </Item>
  );
};

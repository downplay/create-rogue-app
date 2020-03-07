import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Item } from "../meta/Item";
import { Card, Name, Description } from "../../ui/Card";
import { useTerminal } from "../../engine/terminal";

type GoldProps = { amount: number };

export const GoldTile = tile("💰");

export const Gold = ({ amount }: GoldProps) => {
  hasTile(GoldTile, GridLayers.Item);
  const terminal = useTerminal();
  onTake(({ inventory }) => {
    inventory.gold += amount;
    terminal.write(`Picked up 💰${amount}GP`);
  });
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

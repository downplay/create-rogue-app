import React from "react";
import { tile, hasTile } from "../../engine/hasTile";
import { GridLayers } from "../../engine/grid";
import { onTake } from "../../engine/hasInventory";
import { Item } from "../meta/Item";
import { Card, Description } from "../../ui/Card";
import { useTerminal } from "../../engine/terminal";
import { Name } from "../meta/Name";

type GoldProps = { amount: number };

export const GoldTile = tile("💰");

export const Gold = ({ amount }: GoldProps) => {
  hasTile(GoldTile, GridLayers.Item);
  const terminal = useTerminal();
  onTake(({ inventory }) => {
    inventory.gold += amount;
    // TODO: Can automatically write the message based non name of entity
    terminal.write(`Picked up 💰${amount}GP`);
  });
  return (
    <Item>
      <Card>
        <Name>{`${amount}GP`}</Name>
        <Description>
          <GoldTile /> Shiny, shiny gold
        </Description>
      </Card>
    </Item>
  );
};

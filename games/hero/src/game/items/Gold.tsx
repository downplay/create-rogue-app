import { text } from "herotext";
import { GridLayers } from "../../engine/grid";
import { InventoryState } from "../../mechanics/hasInventory";
import { hasTile } from "../../mechanics/hasTile";

type GoldState = { gold: number };

export const Gold = text<GoldState & { actor: InventoryState }>`
${hasTile("💰", GridLayers.Item)}

onTake:~ ($actor)
$actor.conjugate(pocket,pockets) 💰$gold :)
$void(
  $actor.gold=${({ actor, gold }) => actor.gold + gold}
  $destroy
)

Type:
💰$gold

Describe:
Shiny, shiny gold
`;

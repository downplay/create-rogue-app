import { useEntityState } from "./useEntityState";
export type Inventory = {
  gold: number;
};

const InventoryKey = Symbol("Inventory");

export const hasInventory = (inventory?: Inventory) =>
  useEntityState<Inventory>(InventoryKey, inventory);

export const onTake = (handler: (inv: Inventory) => void) => {};

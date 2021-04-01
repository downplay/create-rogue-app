// TODO: Pretty messy how IStateElement is used here
import { text, StoryInstance, IStateElement } from "herotext";

export type InventoryItem = {
  count: number;
  instance: StoryInstance;
};

export type InventoryState = {
  gold: number;
  inventory: InventoryItem[];
};

// TODO: Add methods for take, drop etc...
// ... And need some event system? Trigger events when an object is picked up?
//

export const hasInventory = (initialInventory?: InventoryState) => text`
gold:
${initialInventory ? initialInventory.gold : 0}

inventory:
${
  ((initialInventory
    ? initialInventory.inventory
    : []) as unknown) as IStateElement[]
}
`;

// export const getInventory = stateGetter<Inventory>(InventoryKey);

// const TakeEventKey = Symbol("Take");

// type TakeEvent = {
//   inventory: Inventory;
// };

// export const onTake = (handler: (event: TakeEvent) => void) => {
//   useEvent(TakeEventKey, handler);
// };

// export const fireTake = (actor: EntityContext, loot: EntityContext) => {
//   const inventory = getInventory(actor);
//   const updated = produce(inventory, (next) => {
//     loot.fireEvent(TakeEventKey, { inventory: next });
//   });
//   if (updated !== inventory) {
//     actor.update(InventoryKey, updated);
//   }
// };

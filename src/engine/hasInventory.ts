import { useEntityState, stateGetter } from "./useEntityState";
import { useEvent, EntityContext } from "./useEntitiesState";
import { produce } from "immer";

export type InventoryItem = {
  count: number;
  type: React.ComponentType;
};

export type Inventory = {
  gold: number;
  items: InventoryItem[];
};

const InventoryKey = Symbol("Inventory");

export const hasInventory = (inventory?: Inventory) =>
  useEntityState<Inventory>(InventoryKey, inventory);

export const getInventory = stateGetter<Inventory>(InventoryKey);

const TakeEventKey = Symbol("Take");

type TakeEvent = {
  inventory: Inventory;
};

export const onTake = (handler: (event: TakeEvent) => void) => {
  useEvent(TakeEventKey, handler);
};

export const fireTake = (actor: EntityContext, loot: EntityContext) => {
  const inventory = getInventory(actor);
  const updated = produce(inventory, next => {
    loot.fireEvent(TakeEventKey, { inventory: next });
  });
  // TODO: Big problem here. This conditional shouldn't be needed, we should always
  // be updating base off a live version of the state. But even tho we are checking equality in
  // the update function too, it appears multiple events triggering will cause the last
  // state update to overwrite earlier changes. Very headscratching. See useEntityContext -> update
  // Maybe would be better to pass update callbacks from the events and pass them in as
  // updaters? Not sure if it fixes the issue or just moves it. Will probably be a nasty bug at some point.
  if (updated !== inventory) {
    actor.update(InventoryKey, updated);
  }
};

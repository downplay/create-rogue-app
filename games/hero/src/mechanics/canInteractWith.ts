import { useEvent, EntityContext } from "../engine/useEntitiesState";

const InteractEventKey = Symbol("Interact");

export type InteractEvent = {
  actor: EntityContext;
};

export const onInteract = (handler?: (event: InteractEvent) => void) => {
  useEvent(InteractEventKey, handler);
};

export const fireInteract = (actor: EntityContext, target: EntityContext) => {
  target.fireEvent(InteractEventKey, { actor });
};

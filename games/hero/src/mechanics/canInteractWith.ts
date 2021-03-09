import { text } from "herotext";

// TODO: This is ok for now. As only player will be interacting.
// But eventually need a way to AI monsters & allies to be able to
// interact stuff. Or muliplayer we need to know who interacted.
// interact: ($entity)
// $onInteract($entity)

export const canInteractWith = text`
interact:
$onInteract
`;

// import { useEvent, EntityContext } from "../engine/useEntitiesState";

// const InteractEventKey = Symbol("Interact");

// export type InteractEvent = {
//   actor: EntityContext;
// };

// export const onInteract = (handler?: (event: InteractEvent) => void) => {
//   useEvent(InteractEventKey, handler);
// };

// export const fireInteract = (actor: EntityContext, target: EntityContext) => {
//   target.fireEvent(InteractEventKey, { actor });
// };

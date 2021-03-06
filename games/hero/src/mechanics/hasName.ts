import { useEntityState, stateGetter } from "./useEntityState";

const NameKey = Symbol("Name");

// TODO: Name shouldn't really be state, it's more an attribute or characteristic? More similar to flags.
// Generally always inferred.
export const hasName = (name: string) => useEntityState(NameKey, name);

export const getName = stateGetter<string>(NameKey);

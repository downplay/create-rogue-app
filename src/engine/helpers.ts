import { EntityContext } from "./useEntitiesState";
import { FLAG_PLAYER } from "./flags";

export const elements = <T>(count: number, factory: (n: number) => T): T[] => {
  var output = [];
  for (var n = 0; n < count; n++) {
    output.push(factory(n));
  }
  return output;
};

export const sum = (values: number[]) =>
  values.reduce((total, n) => total + n, 0);

export const conjugate = (actor: EntityContext, self: string, other: string) =>
  actor.getFlag(FLAG_PLAYER) ? self : other;

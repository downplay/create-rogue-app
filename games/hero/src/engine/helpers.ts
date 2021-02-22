import { EntityContext } from "./useEntitiesState";
import { FLAG_PLAYER } from "./flags";

export const elements = <T>(count: number, factory: (n: number) => T): T[] => {
  const output = [];
  for (let n = 0; n < count; n++) {
    output.push(factory(n));
  }
  return output;
};

export const omitUndefined = <T>(input: (T | undefined)[]): T[] =>
  input.filter((value) => value !== undefined) as T[];

export const conjugate = (actor: EntityContext, self: string, other: string) =>
  actor.getFlag(FLAG_PLAYER) ? self : other;

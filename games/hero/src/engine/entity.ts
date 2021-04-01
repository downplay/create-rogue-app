import { merge, text, MainAST } from "herotext";
import { hasPosition, PositionState } from "../mechanics/hasPosition";
import { hasTile, TileState } from "../mechanics/hasTile";
import { StoryInstance } from "herotext";
import { base } from "./base";
import { EngineState } from "./types";
import { FlagsState } from "./flags";

export type EntityState = PositionState & TileState & EngineState & FlagsState;

export type EntityInstance<T> = StoryInstance<T> & {
  entityType: string;
};

const baseEntity = base(text`
${hasPosition()}
${hasTile("☻")}

isEntity:=
true
`);

export const entity = <TState, TGame = {}>(
  story: MainAST<EntityState & TGame & TState>
): MainAST<EntityState & TState & TGame> => {
  const main = merge(baseEntity, story);
  return main;
};

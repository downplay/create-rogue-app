import { merge, text, MainAST, Vector, commonFunctions } from "herotext";
import { hasPosition } from "../mechanics/hasPosition";
import { hasTile } from "../mechanics/hasTile";
import { grammarHelpers } from "./grammarHelpers";
import { StoryInstance } from "herotext";

export type EntityState = {
  position: Vector;
};

export type EntityInstance<T> = StoryInstance<T> & {
  entityType: string;
};

const baseEntity = text`
${hasPosition()}
${hasTile("☻")}

isEntity:=
true

Type:
${() => {
  // TODO: Herotext built-in error throwing (poss: $!)
  throw new Error("Missing entity Type!");
}};

Name:=
$Type
`;

export const entity = <TState, TGame = {}>(
  story: MainAST<
    EntityState & TGame & TState
  > /* | EntityFactory<TState, TGame> */
): MainAST<TState & TGame> => {
  const main = merge(commonFunctions, grammarHelpers, baseEntity, story);
  return main;
};

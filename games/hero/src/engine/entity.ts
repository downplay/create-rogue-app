import { render, merge, text, createRng, MainAST, Vector } from "herotext";
import { hasPosition } from "../mechanics/hasPosition";
import { hasTile } from "../mechanics/hasTile";

export type EntityState = {
  position: Vector;
};

export type EntityTemplate<TState = {}, TGame = {}> = {
  main: MainAST<EntityState & TState & TGame>;
  name: String;
};

// type EntityFactory<TState, TGame> = (
//   game: GameContext<TGame>
// ) => MainAST<TGame & TState>;

const baseEntity = text`
${hasPosition()}
${hasTile("☻")}

isEntity:=
true

Name:=
$Type
`;

export const entity = <TState, TGame = {}>(
  story: MainAST<
    EntityState & TGame & TState
  > /* | EntityFactory<TState, TGame> */
): EntityTemplate<TState, TGame> => {
  const main = merge(baseEntity, story);
  const name = render(story, createRng(), {}, "Name");
  return {
    main,
    name,
  };
};

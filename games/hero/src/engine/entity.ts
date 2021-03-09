import { render, merge, text, createRng, MainAST, Vector } from "herotext";
import { hasPosition } from "../mechanics/hasPosition";
import { hasTile } from "../mechanics/hasTile";
import { ExecutionContext } from "../../../../packages/herotext/src/ExecutionContext";

export type EntityState = {
  position: Vector;
};

export type EntityTemplate<TState extends {} = {}, TGame extends {} = {}> = {
  main: MainAST<EntityState & TState & TGame>;
  name: String;
};

// TODO: Should this be a Herotext type? And be generic?
export type EntityInstance = {
  type: "instance";
  state: EntityState;
  context: ExecutionContext;
  entityType: string;
  template: MainAST;
};

// type EntityFactory<TState, TGame> = (
//   game: GameContext<TGame>
// ) => MainAST<TGame & TState>;

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
): EntityTemplate<TState, TGame> => {
  const main = merge(baseEntity, story);
  const name = render(story, createRng(), {}, "Name");
  return {
    main,
    name,
  };
};

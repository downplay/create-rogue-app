import { MainAST, RNG, StoryInstance } from "@hero/text";
import { useMemo } from "react";
import { grid } from "./grid";
import { GameState } from "./game";
import { Player } from "../game/Player";
import { EntityState } from "./entity";
// import { turnManager } from "./turn";
import { entityManager } from "./entityManager";
import { HeroEngine, EngineState } from "./types";

type Props = {
  game: StoryInstance<GameState>;
  rng: RNG;
};

const createEngine = ({ entityTemplates, rng, game }: Props): HeroEngine => {
  const map = grid();

  const engine: Partial<HeroEngine> = {
    map,
    game,
    rng,
  };

  engine.entities = entityManager(engine as HeroEngine, entityTemplates);
  engine.player = engine.entities.create(Player);
  engine.content = [];
  // const turns = turnManager();

  return engine as HeroEngine;
};

export const create = <T extends {} = {}>(
  template: MainAST<T> | string,
  initialState?: T
) => {
  // TODO: Need to be able to set state within herotext syntax
  // Might look something like:
  // $create(Rat, size: <12>, hp: <10>)
  // Really need to think about this...
  return ({ engine }: EngineState) =>
    engine.entities.create(
      typeof template === "string"
        ? engine.entities.templates[template]
        : template,
      initialState
    );
};

export const useEngine = (props: Props): HeroEngine => {
  return useMemo(() => createEngine(props), [createEngine]);
};

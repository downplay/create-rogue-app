import { MainAST, RNG, StoryInstance } from "herotext";
import { useMemo } from "react";
import { grid } from "./grid";
import { GameState } from "./game";
import { Player } from "../game/Player";
import { EntityState } from "./entity";
// import { turnManager } from "./turn";
import { entityManager } from "./entityManager";
import { HeroEngine } from "./types";

type Props = {
  entityTemplates: MainAST<EntityState>[];
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

export const useEngine = (props: Props): HeroEngine => {
  return useMemo(() => createEngine(props), [createEngine]);
};

import { Grid } from "./grid";
import { TerminalContent } from "../ui/Terminal";
import { StoryInstance, RNG } from "@hero/text";
import { PlayerState } from "../game/Player";
import { GameState } from "./game";
import { EntityManager } from "./entityManager";

export type HeroEngine = {
  map: Grid;
  content: TerminalContent;
  player: StoryInstance<PlayerState>;
  game: StoryInstance<GameState>;
  entities: EntityManager;
  rng: RNG;
};

export type EngineState = {
  engine: HeroEngine;
};

export type SelfState<T extends EngineState = EngineState> = {
  self: StoryInstance<T>;
};

export const LABEL_TYPE = "Type";

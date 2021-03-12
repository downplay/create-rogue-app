import { storyInstance, MainAST, render, RNG } from "herotext";
import { useMemo } from "react";
import { Grid, grid } from "./grid";
import { TerminalContent } from "../ui/Terminal";
import { GameState } from "./game";
import { PlayerState, Player } from "../game/Player";
import { EntityState } from "./entity";

export type HeroEngine = {
  map: Grid;
  content: TerminalContent;
  player: PlayerState;
  game: GameState;
  entities: Record<string, MainAST<EntityState>>;
};

export type EngineState = {
  engine: HeroEngine;
};

type Props = {
  entities: MainAST<EntityState>[];
  rng: RNG;
};

export const LABEL_TYPE = "Type";

const engine = ({ entities, rng }: Props): HeroEngine => {
  const map = grid();
  const playerInstance = storyInstance<PlayerState>(Player);
  // TODO: map is in two places for no reason
  const game: GameState = {
    time: 0,
    turnQueue: [],
    playerTurn: false,
  };
  const entitiesMap = entities.reduce((acc, el) => {
    const type = render(el, rng, {}, LABEL_TYPE);
    if (!type) {
      console.error(el);
      throw new Error("Blank type");
    }
    if (acc[type]) {
      console.error(el);
      throw new Error("Two entities with type " + type);
    }
    acc[type] = el;
    return acc;
  }, {} as Record<string, MainAST>);
  return {
    entities: entitiesMap,
    map,
    player: playerInstance.globalScope,
    content: [],
    game,
  };
};

export const useEngine = (props: Props): HeroEngine => {
  return useMemo(() => engine(props), [engine]);
};

import { storyInstance } from "herotext";
import { useMemo } from "react";
import { EntityTemplate } from "./entity";
import { Grid, grid } from "./grid";
import { TerminalContent } from "../ui/Terminal";
import { GameState } from "./game";
import { PlayerState, Player } from "../game/Player";

export type HeroEngine = {
  map: Grid;
  content: TerminalContent;
  player: PlayerState;
  game: GameState;
  entities: EntityTemplate[];
};

type Props = {
  entities: EntityTemplate[];
};

const engine = ({ entities }: Props): HeroEngine => {
  const map = grid();
  const playerInstance = storyInstance<PlayerState>(Player.main);
  // TODO: map is in two places for no reason
  const game: GameState = {
    time: 0,
    turnQueue: [],
    playerTurn: false,
    grid: map,
  };
  return {
    entities,
    map,
    player: playerInstance.globalScope,
    content: [],
    game,
  };
};

export const useEngine = (props: Props): HeroEngine => {
  return useMemo(() => engine(props), [engine]);
};

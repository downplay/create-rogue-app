import { useMemo } from "react";
import { EntityTemplate } from "./entity";
import { Grid, grid } from "./grid";
import { TerminalContent } from "../ui/Terminal";

export type HeroEngine = {
  map: Grid;
  content: TerminalContent;
  player: PlayerState;
};

type Props = {
  entities: EntityTemplate[];
};

const engine = ({ entities }: Props): HeroEngine => {
  const map = grid();
  return { entities, map };
};

export const useEngine = (props: Props): HeroEngine => {
  return useMemo(() => engine(props), [engine]);
};

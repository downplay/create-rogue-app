import { Vector } from "../engine/vector";
import { Stats } from "../engine/hasStats";
import { Grid } from "../engine/grid";

type BasePlayerState = {
  position: Vector;
  stats: Stats;
};

export type PlayerState = BasePlayerState & {
  updatePosition: (position: Vector) => void;
  updateStats: (stats: Stats) => void;
};

type BaseConsoleState = {
  messages: string[];
};

export type ConsoleState = BaseConsoleState & {
  write: (message: string) => void;
};

type EntitiesStateRecord = Record<string, Record<symbol, any>>;

export type BaseEntitiesState = {
  state: EntitiesStateRecord;
};

export type EntitiesState = BaseEntitiesState & {
  update: (id: string, state: EntitiesStateRecord) => EntitiesState;
  register: (id: string, state: EntitiesStateRecord) => EntitiesState;
  unregister: (id: string) => EntitiesState;
};

export type BaseGridState = {
  map: Grid;
};

export type GridState = BaseGridState & {
  addTile: () => void;
};

export type BaseGameState = {
  player: BasePlayerState;
  grid: BaseGridState;
  entities: BaseEntitiesState;
  console: BaseConsoleState;
};

export type GameState = {
  player: PlayerState;
  grid: GridState;
  entities: EntitiesState;
  console: ConsoleState;
};

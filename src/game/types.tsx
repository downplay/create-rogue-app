import { Vector } from "../engine/vector";
import { Stats } from "../engine/hasStats";
import { Grid } from "../engine/grid";

export type PlayerState = {
  position: Vector;
  stats: Stats;
};

export type PlayerActions = {
  updatePosition: (position: Vector) => void;
  updateStats: (stats: Stats) => void;
};

export type PlayerContext = PlayerState & PlayerActions;

export type TerminalState = {
  messages: string[];
};

export type TerminalActions = {
  write: (message: string) => void;
};

export type TerminalContext = TerminalState & TerminalActions;

export type EntityStateRecord = Record<symbol, any>;

export type EntityContext = {
  state: EntityStateRecord;
  update: <T>(key: symbol, state: T) => void;
};

export type EntitiesStateRecord = Record<string, EntityStateRecord>;

export type EntitiesState = {
  state: EntitiesStateRecord;
};

export type EntitiesActions = {
  register: (id: string, state: EntitiesStateRecord) => void;
  update: (id: string, state: EntitiesStateRecord) => void;
  unregister: (id: string) => void;
};

export type EntitiesContext = EntitiesState & EntitiesActions;

export type GridState = {
  map: Grid;
};

type TileHandle = {};

export type GridActions = {
  addTile: (position: Vector, TileComponent: React.ComponentType) => TileHandle;
  removeTile: (handle: TileHandle) => void;
};

export type GridContext = GridState & GridActions;

export type GameState = {
  player: PlayerState;
  grid: GridState;
  entities: EntitiesState;
  terminal: TerminalState;
};

export type GameActions = {
  player: PlayerActions;
  grid: GridActions;
  entities: EntitiesActions;
  terminal: TerminalActions;
};

export type GameContext = {
  player: PlayerContext;
  grid: GridContext;
  entities: EntitiesContext;
  terminal: TerminalContext;
};

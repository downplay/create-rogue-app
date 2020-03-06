import { GridContext, GridActions, GridState } from "../engine/grid";
import { EntityStateRecord } from "../engine/useEntitiesState";

export type TerminalState = {
  messages: string[];
};

export type TerminalActions = {
  write: (message: string) => void;
};

export type TerminalContext = TerminalState & TerminalActions;

export type SetStateAction<S> = S | ((prevState: S) => S);

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

export type GameState = {
  grid: GridState;
  entities: EntitiesState;
  terminal: TerminalState;
};

export type GameActions = {
  grid: GridActions;
  entities: EntitiesActions;
  terminal: TerminalActions;
};

export type GameContext = {
  grid: GridContext;
  entities: EntitiesContext;
  terminal: TerminalContext;
};

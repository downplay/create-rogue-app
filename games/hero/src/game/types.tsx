import { GridContext, GridActions, GridState } from "../engine/grid";
import { EntityStateRecord } from "../engine/useEntitiesState";
import { GameState, GameActions, GameContext } from "../engine/game";

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
  register: (id: string, state: EntityStateRecord) => void;
  update: (id: string, state: EntityStateRecord) => void;
  unregister: (id: string) => void;
};

export type EntitiesContext = EntitiesState & EntitiesActions;

export type RogueState = {
  game: GameState;
  grid: GridState;
  entities: EntitiesState;
  terminal: TerminalState;
};

export type RogueActions = {
  game: GameActions;
  grid: GridActions;
  entities: EntitiesActions;
  terminal: TerminalActions;
};

export type RogueContext = {
  game: GameContext;
  grid: GridContext;
  entities: EntitiesContext;
  terminal: TerminalContext;
};

import { createContext } from "../helpers/createContext";
import { EntityContext } from "./useEntitiesState";

type Turn = {
  entity: EntityContext;
  time: number;
};

export type GameState = {
  time: number;
  turnQueue: Turn[];
};

export type GameActions = {
  enqueueTurn: (handler: () => number | undefined) => void;
  nextTurn: () => void;
  findTurn: (entity: EntityContext) => Turn;
};

export type GameContext = GameState & GameActions;

export const [useGame, GameProvider] = createContext<GameActions>();
export const [useGameState, GameStateProvider] = createContext<GameState>();

export const gameMutations = {
    enqueueTurn: (handler: () => number | undefined) => void,
    nextTurn: () => (game:GameState) => {
    }
};

export const gameQueries = {
    findTurn: (entity: EntityContext) => (game:GameState) => {
        return game.turnQueue.find(turn=>turn.entity.id === entity.id) 
    }
};

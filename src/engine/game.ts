import { createContext } from "../helpers/createContext";
import { EntityContext, useEvent, useEntity } from "./useEntitiesState";

export const REAL_TIME_SPEED = 100;
export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

type Turn = {
  entity: EntityContext;
  time: number;
};

export type TurnEvent = {
  time: number;
};

export const TurnEventKey = Symbol("TurnEvent");

export type GameState = {
  time: number;
  turnQueue: Turn[];
  playerTurn: boolean;
};

export type GameActions = {
  enqueueTurn: (delta: number, entity: EntityContext) => void;
  nextTurn: () => Turn;
  shiftTurn: () => void;
  advanceTime: (delta: number) => void;
  findTurn: (entity: EntityContext) => Turn | undefined;
  isPlayerTurn: () => boolean;
  setPlayerTurn: (playerTurn: boolean) => void;
};

export type GameContext = GameState & GameActions;

export const [useGame, GameProvider] = createContext<GameActions>();
export const [useGameState, GameStateProvider] = createContext<GameState>();

export const gameMutations = {
  enqueueTurn: (delta: number, entity: EntityContext) => (game: GameState) => {
    const time = game.time + delta;
    const newTurn = { time, entity };

    const insertIndex = game.turnQueue.findIndex(turn => turn.time > time);
    if (insertIndex === -1) {
      game.turnQueue.push(newTurn);
    } else {
      game.turnQueue.splice(insertIndex, 0, newTurn);
    }
  },
  shiftTurn: () => (game: GameState) => {
    const turn = game.turnQueue.shift();
    if (!turn) {
      throw new Error("Out of turns!");
    }
  },
  advanceTime: (delta: number) => (game: GameState) => {
    game.time += delta;
  },
  setPlayerTurn: (playerTurn: boolean) => (game: GameState) => {
    game.playerTurn = playerTurn;
  }
};

export const gameQueries = {
  findTurn: (entity: EntityContext) => (game: GameState) => {
    return game.turnQueue.find(turn => turn.entity.id === entity.id);
  },
  nextTurn: () => (game: GameState) => {
    return game.turnQueue[0];
  },
  isPlayerTurn: () => (game: GameState) => {
    return game.playerTurn;
  }
};

export const onTurn = (handler: (event: TurnEvent) => void) => {
  useEvent(TurnEventKey, handler);
  const game = useGame();
  const entity = useEntity();
  return game.findTurn(entity)?.time;
};

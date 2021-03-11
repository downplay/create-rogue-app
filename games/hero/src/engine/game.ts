import { MainAST, storyInstance } from "herotext";
import { produce } from "immer";
import { createContext } from "../helpers/createContext";
import { EntityContext, useEvent, useEntity } from "./useEntitiesState";
import { Grid } from "./grid";

export const REAL_TIME_SPEED = 50;
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
  enqueueTurn: (delta: number, entity: EntityContext) => (
    game: GameState
  ): [GameState, any] => {
    const time = game.time + delta;
    const newTurn = { time, entity };

    const insertIndex = game.turnQueue.findIndex((turn) => turn.time > time);
    return [
      produce(game, (game) => {
        if (insertIndex === -1) {
          game.turnQueue.push(newTurn);
        } else {
          game.turnQueue.splice(insertIndex, 0, newTurn);
        }
      }),
      undefined,
    ];
  },
  shiftTurn: () => (game: GameState): [GameState, any] => {
    if (!game.turnQueue.length) {
      throw new Error("Out of turns!");
    }
    return [
      produce(game, (game) => {
        game.turnQueue.shift();
      }),
      undefined,
    ];
  },
  advanceTime: (delta: number) => (game: GameState): [GameState, any] => {
    return [
      produce(game, (game) => {
        game.time += delta;
      }),
      undefined,
    ];
  },
  setPlayerTurn: (playerTurn: boolean) => (
    game: GameState
  ): [GameState, any] => {
    return [
      produce(game, (game) => {
        game.playerTurn = playerTurn;
      }),
      undefined,
    ];
  },
};

export const gameQueries = {
  findTurn: (entity: EntityContext) => (game: GameState) => {
    return game.turnQueue.find((turn) => turn.entity.id === entity.id);
  },
  nextTurn: () => (game: GameState) => {
    return game.turnQueue[0];
  },
  isPlayerTurn: () => (game: GameState) => {
    return game.playerTurn;
  },
};

export const onTurn = (handler: (event: TurnEvent) => void) => {
  useEvent(TurnEventKey, handler);
  const game = useGame();
  const entity = useEntity();
  return game.findTurn(entity)?.time;
};

export const game = (main: MainAST) =>
  storyInstance<GameState>(main, {
    playerTurn: false,
    time: 0,
    turnQueue: [],
  });

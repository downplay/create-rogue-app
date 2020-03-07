import { createContext } from "../helpers/createContext";
import { EntityContext, useEvent, useEntity } from "./useEntitiesState";

type Turn = {
  entity: EntityContext;
  time: number;
};

type TurnEvent = {
  time: number;
};

const TurnEventKey = Symbol("TurnEvent");

export type GameState = {
  time: number;
  turnQueue: Turn[];
};

export type GameActions = {
  enqueueTurn: (delta: number, entity: EntityContext) => void;
  nextTurn: () => void;
  findTurn: (entity: EntityContext) => Turn | undefined;
};

export type GameContext = GameState & GameActions;

export const [useGame, GameProvider] = createContext<GameActions>();
export const [useGameState, GameStateProvider] = createContext<GameState>();

export const gameMutations = {
  enqueueTurn: (delta: number, entity: EntityContext) => (game: GameState) => {
    game.turnQueue.push({
      time: game.time + delta,
      entity
    });
  },
  nextTurn: () => async (game: GameState) => {
    const turn = game.turnQueue.shift();
    if (!turn) {
      throw new Error("Out of turns!");
    }
    turn.entity.fireEvent<TurnEvent>(TurnEventKey, { time: game.time });
  }
};

export const gameQueries = {
  findTurn: (entity: EntityContext) => (game: GameState) => {
    return game.turnQueue.find(turn => turn.entity.id === entity.id);
  }
};

export const onTurn = (handler: (event: TurnEvent) => void) => {
  useEvent(TurnEventKey, handler);
  const game = useGame();
  const entity = useEntity();
  return game.findTurn(entity)?.time;
};

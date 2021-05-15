import { StoryInstance } from "@hero/text";

export const REAL_TIME_SPEED = 50;

type Turn = {
  entities: StoryInstance[];
  time: number;
};

export type TurnEvent = {
  entity: StoryInstance;
  time: number;
  delta: number;
};

export type TurnState = {
  time: number;
  turnQueue: Turn[];
  playerTurn: boolean;
};

export type TurnActions = {
  enqueueTurn: (delta: number, entity: StoryInstance) => void;
  nextTurn: () => Turn;
  shiftTurn: () => void;
  advanceTime: (delta: number) => void;
  findTurn: (entity: StoryInstance) => Turn | undefined;
  setPlayerTurn: (playerTurn: boolean) => void;
};

export type TurnManager = TurnState & TurnActions;

export const turnManager = (): TurnManager => {
  const turns: TurnManager = {
    playerTurn: false,
    time: 0,
    turnQueue: [],
    findTurn: (entity: StoryInstance) => {
      return turns.turnQueue.find((turn) => turn.entities.includes(entity));
    },
    nextTurn: () => {
      return turns.turnQueue[0];
    },
    enqueueTurn: (delta: number, entity: StoryInstance) => {
      const time = turns.time + delta;
      for (let i = 0; i < turns.turnQueue.length; i++) {
        if (turns.turnQueue[i].time === time) {
          turns.turnQueue[i].entities.push(entity);
          return;
        }
        if (turns.turnQueue[i].time > time) {
          turns.turnQueue.splice(i, 0, { time, entities: [entity] });
          return;
        }
      }
      turns.turnQueue.push({ time, entities: [entity] });
    },
    shiftTurn: () => {
      if (!turns.turnQueue.length) {
        throw new Error("Out of turns!");
      }
      return turns.turnQueue.shift();
    },
    advanceTime: (delta: number) => {
      turns.time += delta;
    },
    setPlayerTurn: (playerTurn: boolean) => {
      turns.playerTurn = playerTurn;
    },
  };

  return turns;
};

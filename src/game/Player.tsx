import { useCallback, useEffect, useRef } from "react";

import { hasPosition } from "../engine/hasPosition";
import {
  vector,
  VECTOR_N,
  VECTOR_S,
  VECTOR_W,
  VECTOR_E
} from "../engine/vector";
import { hasTile, tile } from "../engine/hasTile";
import { entity } from "../engine/entity";
import { useControls, Commands } from "../engine/controls";
import { canMove } from "../engine/canMove";
import { hasStats, stats } from "../engine/hasStats";
import { GridLayers } from "../engine/grid";
import { useEntity } from "../engine/useEntitiesState";
import { usePlayer } from "../engine/player";
import { useGame, useGameState, TurnEvent, TurnEventKey } from "../engine/game";
import { VECTOR_NW, VECTOR_NE, VECTOR_SE, VECTOR_SW } from "../engine/vector";
import { REAL_TIME_SPEED } from "../engine/game";

const startPosition = vector(5, 5);

const PlayerTile = tile("🧙");

const commands = [
  Commands.MoveUp,
  Commands.MoveDown,
  Commands.MoveLeft,
  Commands.MoveRight,
  Commands.MoveNW,
  Commands.MoveNE,
  Commands.MoveSE,
  Commands.MoveSW
];

export const Player = entity(() => {
  hasPosition(startPosition);
  hasTile(PlayerTile, GridLayers.Actor);
  const [currentStats] = hasStats(stats(10, 5, 5, 5, 10));

  const player = usePlayer();
  const entity = useEntity();
  const game = useGame();
  const gameState = useGameState();

  useEffect(() => {
    nextTurn();
  }, []);

  useEffect(() => {
    player.register(entity);
  }, [entity]);

  const [move] = canMove();

  const nextTurn = () => {
    game.setPlayerTurn(false);
    game.enqueueTurn(10 / currentStats.spd, entity);
  };

  const handleControls = useCallback(
    (command: Commands) => {
      if (!game.isPlayerTurn()) {
        return;
      }
      switch (command) {
        case Commands.MoveUp:
          move(VECTOR_N);
          break;
        case Commands.MoveDown:
          move(VECTOR_S);
          break;
        case Commands.MoveLeft:
          move(VECTOR_W);
          break;
        case Commands.MoveRight:
          move(VECTOR_E);
          break;
        case Commands.MoveNW:
          move(VECTOR_NW);
          break;
        case Commands.MoveNE:
          move(VECTOR_NE);
          break;
        case Commands.MoveSE:
          move(VECTOR_SE);
          break;
        case Commands.MoveSW:
          move(VECTOR_SW);
          break;
      }
      nextTurn();
    },
    [move]
  );

  useControls(commands, handleControls);

  // TODO: Consider options for inputs
  // const [name, done] = useInput("What is your name, mortal?");
  // // or
  // useInput("What is your name, mortal?", name => {
  //   player.setName(name);
  // });

  // MAIN GAME LOOP
  // That's right, it's down here ↓
  useEffect(() => {
    if (game.isPlayerTurn()) {
      return;
    }
    let doneTick = false;
    while (!doneTick) {
      const turn = game.nextTurn();
      if (turn.time <= gameState.time) {
        game.shiftTurn();
        if (turn.entity.id === entity.id) {
          game.setPlayerTurn(true);
          doneTick = true;
        } else {
          turn.entity.fireEvent<TurnEvent>(TurnEventKey, {
            time: gameState.time
          });
        }
      } else {
        doneTick = true;
        const delta = turn.time - gameState.time;
        setTimeout(() => {
          game.advanceTime(delta);
        }, delta * REAL_TIME_SPEED);
      }
    }
  }, [gameState.time, gameState.playerTurn]);

  return null;
});

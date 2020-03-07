import React, { useCallback, useEffect } from "react";

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
import { GridLayers, useGrid } from "../engine/grid";
import { useEntity } from "../engine/useEntitiesState";
import { usePlayer } from "../engine/player";
import { useGame, useGameState, TurnEvent, TurnEventKey } from "../engine/game";
import { VECTOR_NW, VECTOR_NE, VECTOR_SE, VECTOR_SW } from "../engine/vector";
import { REAL_TIME_SPEED } from "../engine/game";
import { canLiveAndDie } from "../engine/hasLife";
import { hasInventory, fireTake } from "../engine/hasInventory";
import { Card, Description } from "../ui/Card";
import { Name } from "./meta/Name";

const startPosition = vector(1, 1);

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
  hasInventory({ gold: 0 });
  const [currentStats] = hasStats(stats(10, 5, 5, 5, 10));

  const player = usePlayer();
  const entity = useEntity();
  const game = useGame();
  const grid = useGrid();
  const gameState = useGameState();

  canLiveAndDie();

  useEffect(() => {
    nextTurn();
  }, []);

  useEffect(() => {
    player.register(entity);
  }, [entity]);

  const [move] = canMove();
  const [position] = hasPosition();

  /**
   * Will become canTake behaviour?
   * And will be optional:
   *  - Player presses a key
   *  - Monster sometimes takes depending on AI / greed / need
   * Quick thoughts on this.
   * Either way we're describing a command (move/take/etc) that will be performed on the turn.
   * Generalising this increases the symmetry between player and monster taking a turn.
   * For monster:
   *   - on turn, ai processes list of possible commands, assigns each a score
   *   - pick best command, with some fuzzing
   *   - enqueue command
   *   - execute command and advance turn
   *   - command determines time to next turn
   * For player:
   *   - player inputs command via keys and/or UI elements
   *   - command is enqueued
   *   - on turn, check command queue or wait
   *   - execute command and advance turn
   *   - command determines time to next turn
   */
  useEffect(() => {
    // Check floor and collect item
    if (!position) {
      return;
    }
    const cell = grid.getCell(position);
    for (const tile of cell.tiles) {
      // TODO: if same entity rendered multiple times we'd interact multiple times;
      // should instead store a unique list of entities to only do this once. Also we wouldn't
      // have to check if entity exists on next line
      if (tile.entity) {
        fireTake(entity, tile.entity);
      }
    }
    // Pickup automatically (for now)
  }, [position]);

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

  return (
    <Card>
      <Name>You</Name>
      <Description>
        <PlayerTile /> A mighty wizard! With a pointy hat.
      </Description>
    </Card>
  );
});

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
import { useCallback, useEffect } from "react";
import { canMove } from "../engine/canMove";
import { hasStats, stats } from "../engine/hasStats";
import { GridLayers } from "../engine/grid";
import { useEntity } from "../engine/useEntitiesState";
import { usePlayer } from "../engine/player";
import { useGame, onTurn } from "../engine/game";
import { VECTOR_NW, VECTOR_NE, VECTOR_SE, VECTOR_SW } from "../engine/vector";

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

  useEffect(() => {
    player.register(entity);
  }, []);

  const [move] = canMove();

  const nextTurn = () => {
    game.enqueueTurn(10 / currentStats.spd, entity);
  };

  const nextTime = onTurn(() => {
    nextTurn();
  });

  useEffect(() => {
    if (nextTime === undefined) {
      nextTurn();
    }
  }, [nextTime]);

  const handleControls = useCallback(
    (command: Commands) => {
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

  return null;
});

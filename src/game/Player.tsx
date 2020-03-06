import { hasPosition } from "../engine/hasPosition";
import { vector } from "../engine/vector";
import { hasTile, tile } from "../engine/hasTile";
import { entity } from "../engine/entity";
import { useControls, Commands } from "../engine/controls";
import { useCallback, useEffect } from "react";
import { canMove } from "../engine/canMove";
import { hasStats, stats } from "../engine/hasStats";
import { GridLayers } from "../engine/grid";
import { useEntity } from "../engine/useEntitiesState";
import { usePlayer } from "../engine/player";
import { useGame } from "../engine/game";

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

  const [nextTurn] = hasTurn(nextTurn => {});

  useEffect(() => {
    if (nextTurn === undefined) {
      game.enqueueTurn(10 / currentStats.spd, entity);
    }
  }, [nextTurn]);

  const handleControls = useCallback(
    (command: Commands) => {
      switch (command) {
        case Commands.MoveUp:
          move(vector(0, -1));
          break;
        case Commands.MoveDown:
          move(vector(0, 1));
          break;
        case Commands.MoveLeft:
          move(vector(-1, 0));
          break;
        case Commands.MoveRight:
          move(vector(1, 0));
          break;
        case Commands.MoveNW:
          move(vector(-1, -1));
          break;
        case Commands.MoveNE:
          move(vector(1, -1));
          break;
        case Commands.MoveSE:
          move(vector(1, 1));
          break;
        case Commands.MoveSW:
          move(vector(-1, 1));
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

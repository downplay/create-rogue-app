import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster, Name, Description, Card } from "../meta/Monster";
import { entity } from "../../engine/entity";
import { hasStats, stats } from "../../engine/hasStats";
import { GridLayers } from "../../engine/grid";
import { useGame, onTurn } from "../../engine/game";
import { usePlayer } from "../../engine/player";
import { canMove } from "../../engine/canMove";
import { useRng } from "../../engine/useRng";
import { useEffect } from "react";
import {
  VECTOR_ORIGIN,
  VECTOR_N,
  VECTOR_NE,
  VECTOR_E,
  VECTOR_SE,
  VECTOR_S,
  VECTOR_SW,
  VECTOR_W,
  VECTOR_NW
} from "../../engine/vector";
import { useEntity } from "../../engine/useEntitiesState";

const ratStats = stats(2, 1, 3, 0, 10);

const RatTile = tile("🐀");

const moves = [
  VECTOR_ORIGIN,
  VECTOR_N,
  VECTOR_NE,
  VECTOR_E,
  VECTOR_SE,
  VECTOR_S,
  VECTOR_SW,
  VECTOR_W,
  VECTOR_NW
];

export const Rat = entity(() => {
  hasTile(RatTile, GridLayers.Actor);

  const stats = hasStats(ratStats);

  const entity = useEntity();
  const game = useGame();

  const [move] = canMove();

  const random = useRng();

  const nextTurn = () => {
    game.enqueueTurn(1 + random.range(-0.1, 0.1), entity);
  };

  const nextTime = onTurn(() => {
    move(random.pick(moves));
    nextTurn();
  });

  useEffect(() => {
    if (nextTime === undefined) {
      nextTurn();
    }
  }, [nextTime]);

  return (
    <Monster>
      <Card>
        <Name>
          <RatTile />
          Rat
        </Name>
        <Description>A smelly, mangy rodent</Description>
      </Card>
    </Monster>
  );
});

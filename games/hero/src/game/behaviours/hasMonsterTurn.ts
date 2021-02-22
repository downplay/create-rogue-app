import { useEffect, useCallback } from "react";
import { useGame, onTurn, TurnEvent } from "../../engine/game";
import { hasStats } from "../../engine/hasStats";
import { useRng } from "../../engine/useRng";
import { useEntity } from "../../engine/useEntitiesState";

export const hasMonsterTurn = (handleTurn: (event: TurnEvent) => void) => {
  const entity = useEntity();
  const game = useGame();
  const random = useRng();
  const [stats] = hasStats();

  const nextTurn = () => {
    game.enqueueTurn(
      10 / random.range(stats.spd * 0.9, stats.spd * 1.1),
      entity
    );
  };

  const nextTime = onTurn(
    useCallback(
      event => {
        handleTurn(event);
        nextTurn();
      },
      [stats]
    )
  );

  useEffect(() => {
    if (nextTime === undefined) {
      nextTurn();
    }
  }, [nextTime]);
};

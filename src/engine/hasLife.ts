import { useEffect, useRef } from "react";
import { Vector } from "./vector";
import { useEntityState, stateGetter } from "./useEntityState";
import { useEntity, EntityContext } from "./useEntitiesState";
import { hasStats } from "./hasStats";

export type PositionProps = { position: Vector };

const LifeKey = Symbol("Life");
const DeathKey = Symbol("Death");

export const hasLife = (life: number) => useEntityState<number>(LifeKey, life);
export const hasDeath = () => useEntityState<boolean>(DeathKey, false);

// Fairly important not to call this twice on same entity or the
// effect and events etc get doubled up.
// TODO: Should double check if this is the case on some other hooks as well.
// Could be an annoying issue; no real good way to get around this without
// possibly some abuse of Fiber, breaking rules of hooks with conditional hooks
// (which would be ok as long as we never run them the second time), eslnt rules
// to spot this pattern, etc. etc. ...
// Also not happy with the name, this is not an ability pattern, it's a kind of controller.
export const canLiveAndDie = () => {
  const entity = useEntity();
  const [stats] = hasStats();
  const oldHpRef = useRef<number>(0);

  const [life, setLife] = hasLife(stats.hp);
  const [isDead, setDeath] = hasDeath();

  const updateLife = (newLife: number) => {
    // Clamp to 0..1
    // TODO: clamp function in some math utils
    const clamped = Math.max(0, Math.min(newLife, stats.hp));
    setLife(clamped);
  };

  const die = () => {
    setDeath(true);
  };

  // Manage initializtion and stat adjusted
  useEffect(() => {
    if (stats === undefined) {
      return;
    }
    if (life === undefined) {
      // Initialise to full life
      updateLife(stats.hp);
    } else {
      // If hp has increased, increase life accordingly
      updateLife(life + stats.hp - oldHpRef.current);
    }
    oldHpRef.current = stats.hp;
  }, [stats.hp]);

  useEffect(() => {
    if (life !== undefined && life <= 0) {
      die();
    }
  }, [life]);

  return [life, updateLife];
};

export const getLife = stateGetter<number>(LifeKey);

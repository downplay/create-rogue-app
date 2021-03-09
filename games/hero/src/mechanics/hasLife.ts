import { conjugate } from "../engine/helpers";
import { useEffect, useRef } from "react";
import { Vector } from "./vector";
import { useEntityState, stateGetter, stateSetter } from "./useEntityState";
import { hasStats } from "./hasStats";
import { useEntity } from "./useEntitiesState";
import { getName } from "./hasName";
import { text } from '../../../../packages/herotext/src/text';

export type PositionProps = { position: Vector };

const LifeKey = Symbol("Life");
const DeathKey = Symbol("Death");

export const hasLife = (life: number) => useEntityState<number>(LifeKey, life);
export const hasDeath = () => useEntityState<boolean>(DeathKey, false);

  // TODO: Probably we don't want to check isDead literally everywhere ... think of a way to completely
  // shut down the entity after death. Maybe similar to isDestroyed, but do it in an `actor()` HoC?
// TODO: Calculate health based on stats. Update on stats change.

export const canLiveAndDie = (health: number = 10) => text`
life:=
${health}

health:=
${health}

isDead:=
${false}

die:
[$isDead=${true}]$title($Name) $conjugate(die,dies).

updateLife: ($newLife) => {
    // Clamp to 0..1
    // TODO: clamp function in  math lib
    const clamped = Math.max(0, Math.min(newLife, stats.hp));
    setLife(clamped);
  };

  const die = () => {
    terminal.write(`${getName(actor)} ${conjugate(actor, "die", "dies")}!`);
    setDeath(true);
  };

  // Manage initialization and stat adjusted
  useEffect(() => {
    if (stats === undefined || isDead) {
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
    if (!isDead && life !== undefined && life <= 0) {
      die();
    }
  }, [life]);

  return [life, updateLife];
};

export const getLife = stateGetter<number>(LifeKey);
export const setLife = stateSetter<number>(LifeKey);
export const getDeath = stateGetter<boolean>(DeathKey);

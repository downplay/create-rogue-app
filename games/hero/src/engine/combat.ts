import { EntityContext, useEntity } from "./useEntitiesState";
import { useRng } from "./useRng";
import { getStats } from "./hasStats";
import { useTerminal } from "./terminal";
import { conjugate } from "./helpers";
import { getName } from "./hasName";
import { setLife, getLife } from "./hasLife";

export const useCombat = () => {
  const random = useRng();
  const attacker = useEntity();
  const terminal = useTerminal();
  // TODO: All kinds of extra stuff needs to come into play such as what terrain do they
  // fight on
  return (defender: EntityContext) => {
    const attackerStats = getStats(attacker);
    if (!attackerStats) {
      console.error(attacker);
      throw new Error("Cannot attack without stats!");
    }
    const defenderStats = getStats(defender);

    if (!defenderStats) {
      console.error(defender);
      throw new Error("Cannot defend without stats!");
    }
    // TODO: algo should be WAY more sophisticated, and we're not even looking at armour yet ...
    const attackRoll = random.dice(attackerStats.dex, attackerStats.str);
    const defenceRoll = random.dice(defenderStats.dex, defenderStats.str);
    const damage = Math.max(attackRoll - defenceRoll, 0);
    const attackerName = getName(attacker);
    const defenderName = getName(defender);
    const attackVerb = conjugate(attacker, "attack", "attacks");
    if (damage > 0) {
      terminal.write(
        `${attackerName} ${attackVerb} ${defenderName} for ${damage} damage!`
      );
      setLife(defender, (getLife(defender) || 0) - damage);
    } else {
      const missVerb = conjugate(attacker, "miss", "misses");
      terminal.write(
        `${attackerName} ${attackVerb} ${defenderName} but ${missVerb}!`
      );
    }
  };
};

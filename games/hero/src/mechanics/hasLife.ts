import { text } from "herotext";

export type LifeProps = { life: number; health: number; isDead: boolean };

type LabelProps = LifeProps & { old: LifeProps; newLife: number };

export const canLiveAndDie = (health: number = 10) => text<LabelProps>`
life:=
${health}

health:=
${health}

isDead:=
${false}

die:
// TODO: Probably we don't want to check isDead literally everywhere ... think of a way to completely
// shut down the entity after death. Or spawn a corpse just with same tile.
[$isDead=${true}]$conjugate($Name,The $lower($Name)) $conjugate(die,dies)!

updateLife: ($newLife)
// Clamp to 0..1
// TODO: clamp function in  math lib
$life=${({ health, newLife }) =>
  Math.max(0, Math.min(newLife, health))}$checkDeath

checkDeath: 
{!$isDead,$life<=0}$die

onStatsChanged:~ ($old)
// TODO: Calculate health based on stats. Update on stats change.
$updateLife(${({ life, health, old }) =>
  health !== old.health ? life + health - old.health : life})
`;

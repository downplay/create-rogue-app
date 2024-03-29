import { text } from "@hero/text";

export type Stats = {
  mind: number;
  body: number;
  spirit: number;
};

export type DerivedStats = {
  speed: number;
};

export type StatsState = {
  stats: Stats;
  derived: DerivedStats;
};

export const stats = (mind: number, body: number, spirit: number): Stats => ({
  mind,
  body,
  spirit,
});

const IDENTITY = stats(1, 1, 1);

/* TODO:
   1. Adjusted stats
   Temporary effects, item effects etc will 
   
   2. Derived stats
   Based on combos; 
      - agility | stamina = body & mind
      - magic power | mana = spirit & mind
      - con | h.p. = body & spirit
      - speed = agility / (size - body)
*/

export const hasStats = (baseStats: Stats = IDENTITY) => text<StatsState>`

setup:+~
$stats

stats:=
${baseStats}
`;

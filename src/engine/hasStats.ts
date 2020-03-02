import { useEntityState } from "./useEntityState";
export type Stats = {
  hp: number;
  str: number;
  dex: number;
  int: number;
  spd: number;
};

export const stats = (
  hp: number,
  str: number,
  dex: number,
  int: number,
  spd: number
): Stats => ({
  hp,
  str,
  dex,
  int,
  spd
});

const StatsKey = Symbol("stats");

const IDENTITY = stats(1, 1, 1, 1, 1);

export const hasStats = (baseStats: Stats = IDENTITY) => {
  const [currentStats, setStats] = useEntityState(StatsKey, baseStats);

  const adjustedStats = currentStats;

  return [currentStats, adjustedStats, setStats];
};

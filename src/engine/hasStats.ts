import { useEntityState, stateGetter } from "./useEntityState";
import { SetStateAction } from "../game/types";

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

export const hasStats = (
  baseStats?: Stats
): [Stats, Stats, React.Dispatch<SetStateAction<Stats>>] => {
  const [currentStats, setStats] = useEntityState(StatsKey, baseStats);

  const adjustedStats = currentStats;

  return [currentStats || IDENTITY, adjustedStats || IDENTITY, setStats];
};

export const getStats = stateGetter<Stats>(StatsKey);

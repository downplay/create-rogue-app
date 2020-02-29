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

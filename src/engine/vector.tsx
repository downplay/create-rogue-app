export type Vector = {
  x: number;
  y: number;
};

export const vector = (x: number | Vector, y: number): Vector => ({ x, y });

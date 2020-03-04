export type Vector = {
  x: number;
  y: number;
};

export const vector = (x: number | Vector, y: number): Vector =>
  typeof x === "number" ? { x, y } : x;

export const ORIGIN = vector(0, 0);

export const add = (a: Vector, b: Vector) => vector(a.x + b.x, a.y + b.y);

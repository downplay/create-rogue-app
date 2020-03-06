export type Vector = {
  x: number;
  y: number;
};

export const vector = (x: number | Vector, y: number): Vector =>
  typeof x === "number" ? { x, y } : x;

export const VECTOR_ORIGIN = vector(0, 0);
export const VECTOR_N = vector(0, -1);
export const VECTOR_NE = vector(1, -1);
export const VECTOR_E = vector(1, 0);
export const VECTOR_SE = vector(1, 1);
export const VECTOR_S = vector(0, 1);
export const VECTOR_SW = vector(-1, 1);
export const VECTOR_W = vector(-1, 0);
export const VECTOR_NW = vector(-1, -1);

export const add = (a: Vector, b: Vector) => vector(a.x + b.x, a.y + b.y);

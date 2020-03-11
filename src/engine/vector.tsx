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

export const add = (a: Vector, b: Vector): Vector =>
  vector(a.x + b.x, a.y + b.y);

export const multiply = (a: Vector, b: Vector | number): Vector =>
  typeof b === "number"
    ? vector(a.x * b, a.y * b)
    : vector(a.x * b.x, a.y * b.y);

export const equals = (a: Vector, b: Vector): boolean =>
  a.x === b.x && a.y === b.y;

/**
 * Given two corners which could be NE/NW/SE/SW, recomposes as NW & SE corners
 */
export const sortCorners = (a: Vector, b: Vector): [Vector, Vector] => {
  // TODO: Probably slightly more optimised version of this
  const minX = Math.min(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxX = Math.max(a.x, b.x);
  const maxY = Math.max(a.y, b.y);
  return [vector(minX, minY), vector(maxX, maxY)];
};

export const iterateQuad = (
  a: Vector,
  b: Vector,
  callback: (value: Vector) => void
) => {
  for (let y = a.y; y <= b.y; y++) {
    for (let x = a.x; x <= b.x; x++) {
      callback(vector(x, y));
    }
  }
};

/**
 * Reduces all vectors inside quad bounded by corners (a,b) inclusive, resulting in an array of T
 */
export const reduceQuad = <T,>(
  a: Vector,
  b: Vector,
  callback: (value: Vector) => T
): T[] => {
  const output: T[] = [];
  iterateQuad(a, b, value => output.push(callback(value)));
  return output;
};

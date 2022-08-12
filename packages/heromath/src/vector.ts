export type Vector = {
    x: number
    y: number
}

export type Vector3 = Vector & { z: number }

declare type DefinitelyVector<T> = Extract<T, Vector> extends never ? Vector : Extract<T, Vector>

// TODO: 3D vectors
export const isVector = <T>(test: T | Vector): test is DefinitelyVector<T> =>
    test &&
    "x" in test &&
    "y" in test &&
    Object.keys(test).length === 2 &&
    typeof test.x === "number" &&
    typeof test.y === "number"

export const vector: {
    (x: number, y: number, z: number): Vector3
    (x: number, y: number): Vector
    (v: Vector): Vector
} = (x, y?, z?) => {
    if (typeof z === "number") {
        return { x, y, z }
    }
    return typeof x === "number" ? { x, y: y as number } : x
}
//  ? { x, y } : x;

export const vectorKey = ({ x, y }: Vector) => `${x}_${y}`

export const VECTOR3_ORIGIN = vector(0, 0, 0)
export const VECTOR_ORIGIN = vector(0, 0)
export const VECTOR_N = vector(0, -1)
export const VECTOR_NE = vector(1, -1)
export const VECTOR_E = vector(1, 0)
export const VECTOR_SE = vector(1, 1)
export const VECTOR_S = vector(0, 1)
export const VECTOR_SW = vector(-1, 1)
export const VECTOR_W = vector(-1, 0)
export const VECTOR_NW = vector(-1, -1)

export const addTwo = (a: Vector, b: Vector): Vector => vector(a.x + b.x, a.y + b.y)

export const add = (a: Vector, ...values: Vector[]): Vector =>
    values.reduce((acc, value) => addTwo(acc, value), a)

export const subtractTwo = (a: Vector, b: Vector): Vector => vector(a.x - b.x, a.y - b.y)

export const subtract = (a: Vector, ...values: Vector[]): Vector =>
    values.reduce((acc, value) => subtractTwo(acc, value), a)

export const multiply = (a: Vector, b: Vector | number): Vector =>
    typeof b === "number" ? vector(a.x * b, a.y * b) : vector(a.x * b.x, a.y * b.y)

export const equals = (a: Vector, b: Vector): boolean => a.x === b.x && a.y === b.y

/**
 * Given two corners which could be NE/NW/SE/SW, recomposes as NW & SE corners
 */
export const sortCorners = (a: Vector, b: Vector): [Vector, Vector] => {
    // TODO: Probably slightly more optimised version of this
    const minX = Math.min(a.x, b.x)
    const minY = Math.min(a.y, b.y)
    const maxX = Math.max(a.x, b.x)
    const maxY = Math.max(a.y, b.y)
    return [vector(minX, minY), vector(maxX, maxY)]
}

export const iterateQuad = (a: Vector, b: Vector, callback: (value: Vector) => void) => {
    for (let y = a.y; y <= b.y; y++) {
        for (let x = a.x; x <= b.x; x++) {
            callback(vector(x, y))
        }
    }
}

/**
 * Reduces all vectors inside quad bounded by corners (a,b) inclusive, resulting in an array of T
 */
export const reduceQuad = <T>(a: Vector, b: Vector, callback: (value: Vector) => T): T[] => {
    const output: T[] = []
    iterateQuad(a, b, (value) => output.push(callback(value)))
    return output
}

/**
 * Maps over all vectors inside quad bounded by corners (a,b) inclusive, resulting in a 2D array of T
 */
export const mapQuad = <T>(a: Vector, b: Vector, callback: (value: Vector) => T): T[][] => {
    const rows: Record<number, Record<number, T>> = {}
    iterateQuad(a, b, (value) => {
        rows[value.y] = rows[value.y] || {}
        rows[value.y][value.x] = callback(value)
    })
    return Object.values(rows).map((row) => Object.values(row))
}

export const length = (of: Vector) => Math.sqrt(of.x * of.x + of.y * of.y)

export const normalize = (value: Vector) => multiply(value, 1 / length(value))

export const copy = (source: Vector) => ({ x: source.x, y: source.y })

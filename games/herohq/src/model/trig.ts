// TODO: Absolutely sure there should be a built-in method for this but I cannot find it!
// TODO: Move to a utility module

import { Vector2 } from "three"

export const VECTOR2_UP = new Vector2(0, -1)

// https://gamedev.stackexchange.com/questions/200393/calculate-the-angle-of-rotation-between-two-vectors-relative-to-the-first-vector
export const angleBetween = (a: Vector2, b: Vector2) => {
    // Get a vector rotated 90 degrees from a.
    const perpendicular = new Vector2(a.y, -a.x)

    // Compute a scaled projection of b onto the original and rotated version.
    const x = a.dot(b)
    const y = perpendicular.dot(b)

    // Treat these as a point in a coordinate system where a is the x axis,
    // and perpendicular is the y axis, and get the polar angle of that point.
    return Math.atan2(y, x)
}

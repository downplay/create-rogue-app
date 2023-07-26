import { useMemo } from "react"
import { Vector3 } from "three"

/**
 * When doing vector math to avoid creating new THREE.Vector3 instances every render,
 * and keep renders stable and avoid triggering downline memos.
 *
 * Should not be used if changing value frequently or if x,y,z are non-trivial calculations.
 *
 * TODO: Implement some ref version after testing if it'll work
 *
 * @param x
 * @param y
 * @param z
 */
export const useVector = (x: number, y: number, z: number) => {
    return useMemo(() => new Vector3(x, y, z), [x, y, z])
}

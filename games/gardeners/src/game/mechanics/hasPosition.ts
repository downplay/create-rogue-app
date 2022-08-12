import { Vector3, VECTOR3_ORIGIN } from "@hero/math"
import { defineData, hasData } from "../../engine/data"
import { DataRef } from "../../engine/types"

export const PositionData = defineData<Vector3>("Position")

export const hasPosition = (
    initial: Vector3 = VECTOR3_ORIGIN
): [position: DataRef<Vector3>, setPosition: (...values: [Vector3] | number[]) => void] => {
    const [position, setPosition] = hasData(PositionData, initial)
    return [
        position,
        (...values: [Vector3] | number[]) => {
            if (typeof values[0] === "number") {
                setPosition({
                    x: values[0],
                    y: (values[1] as number) || 0,
                    z: (values[2] as number) || 0
                })
            } else {
                setPosition(values[0])
            }
        }
    ]
}

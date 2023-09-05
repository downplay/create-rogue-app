import { useMemo } from "react"
import { ExtrudeGeometry, Shape } from "three"
import { makeMetalMaterial, makeToonMaterial } from "../../3d/materials"
import { WithToss } from "../../3d/physics/wrappers"
import { ActorProps } from "../../model/actor"

// TODO: Vary material for different swords
// - wood
// - bronze
// - iron
// - steel
// - titanium
// - unobtainium

const material = makeMetalMaterial([0.49, 0.208, 0.403])

export const SwordRender = ({ id, mode }: ActorProps) => {
    // NOTE: Problem with using Extrude to make the sword, it limits us a bit once we want to do more advanced
    // stuff like mixing and matching different hilts and blades, attaching gems to the sword, and that kind of gubbins.
    // we need an easy way to take an arbitrary mesh but wrap our own Position stuff around it so we can compose things better.

    // Widths are actually 1/2 widths
    const handleWidth = 0.05
    const handleLength = 0.3
    const guardWidth = 0.2
    const guardLength = 0.1
    const bladeWidth = 0.1
    const bladeLength = 0.6

    const geometry = useMemo(() => {
        const shape = new Shape()
        shape.moveTo(0, 0)
        shape.lineTo(handleWidth, 0)
        shape.lineTo(handleWidth, handleLength)
        shape.lineTo(guardWidth, handleLength)
        shape.lineTo(guardWidth, handleLength + guardLength)
        shape.lineTo(bladeWidth, handleLength + guardLength)
        shape.lineTo(0, handleLength + guardLength + bladeLength)
        shape.lineTo(-bladeWidth, handleLength + guardLength)
        shape.lineTo(-guardWidth, handleLength + guardLength)
        shape.lineTo(-guardWidth, handleLength)
        shape.lineTo(-handleWidth, handleLength)
        shape.lineTo(-handleWidth, 0)
        shape.lineTo(0, 0)
        const extrusion = new ExtrudeGeometry(shape, {
            steps: 2,
            depth: 0.2,
            bevelEnabled: false
        })
        return extrusion
    }, [])
    return mode === "game" ? (
        <WithToss position={[0, 0.5, 0]}>
            <mesh geometry={geometry}>{material}</mesh>
        </WithToss>
    ) : mode === "equip" ? (
        <mesh geometry={geometry} scale={0.5}>
            {material}
        </mesh>
    ) : (
        <mesh geometry={geometry}>{material}</mesh>
    )
}

import { useMemo, useRef } from "react"
import { ExtrudeGeometry, Shape } from "three"
import { makeMetalMaterial, makeToonMaterial } from "../../3d/materials"
import { WithToss } from "../../3d/physics/wrappers"
import { ActorProps } from "../../model/actor"
import { PhysicsActor, SelectableActor } from "../Actor"
import { RapierRigidBody, RigidBody, useFixedJoint } from "@react-three/rapier"
import { EquipActorProps } from "../../model/equip"
import { join } from "remeda"

// TODO: Vary material for different swords
// - wood
// - bronze
// - iron
// - steel
// - titanium
// - unobtainium

const material = makeMetalMaterial([0.49, 0.208, 0.403])

const Sword = ({ scale = 1 }) => {
    // NOTE: Problem with using Extrude to make the sword, it limits us a bit once we want to do more advanced
    // stuff like mixing and matching different hilts and blades, attaching gems to the sword, and that kind of gubbins.
    // we need an easy way to take an arbitrary mesh but wrap our own Position stuff around it so we can compose things better.

    // Widths are actually 1/2 widths

    const geometry = useMemo(() => {
        const handleWidth = 0.05 * scale
        const handleLength = 0.3 * scale
        const guardWidth = 0.2 * scale
        const guardLength = 0.1 * scale
        const bladeWidth = 0.1 * scale
        const bladeLength = 0.6 * scale
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
            depth: 0.2 * scale,
            bevelEnabled: false
        })
        return extrusion
    }, [scale])
    return <mesh geometry={geometry}>{material}</mesh>
}

export const SwordRender = ({ id, mode }: ActorProps) => {
    const bodyRef = useRef<RapierRigidBody>(null)
    return mode === "game" ? (
        <SelectableActor id={id}>
            <PhysicsActor id={id} bodyRef={bodyRef}>
                <WithToss ref={bodyRef} position={[0, 0.5, 0]}>
                    <Sword scale={0.6} />
                </WithToss>
            </PhysicsActor>
        </SelectableActor>
    ) : (
        <Sword />
    )
}

export const SwordRenderEquip = ({ id, handleRef }: EquipActorProps) => {
    const bodyRef = useRef<RapierRigidBody>(null)

    const joint = useFixedJoint(handleRef, bodyRef, [
        [0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 0],
        [0, 0, 0, 1]
    ])
    return (
        <RigidBody ref={bodyRef}>
            <Sword scale={0.5} />
        </RigidBody>
    )
}

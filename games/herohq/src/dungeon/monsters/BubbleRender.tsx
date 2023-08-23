import { useCallback, useEffect, useMemo, useRef } from "react"
import { Ball, Position } from "../../3d/Parts"
import { makeGlassMaterial } from "../../3d/materials"
import {
    ActorProps,
    SpeedModule,
    actorFamily,
    gameTimeTicksAtom,
    useActor,
    useModule
} from "../../model/actor"
import { useFrame } from "@react-three/fiber"
import { useAtomCallback } from "jotai/utils"
import { Group } from "three"
import { useSetAtom } from "jotai"
import { RigidBody } from "@react-three/rapier"

const BODY_MATERIAL = makeGlassMaterial(0.6, 0.8, 0.8)
const BODY_DIAMETER = 0.8

const BOUNCE_SPEED_MULTIPLIER = 2.5
const BOUNCE_HEIGHT_MULTIPLIER = 0.7

export const BubbleRender = ({ id, selected }: ActorProps) => {
    // const movement = useModule(MovementModule, id)
    // const animate = movement.status === "moving"
    // const currentTime = useAtomRef(gameTimeTicksAtom)
    const readCurrentTime = useAtomCallback(useCallback((get) => get(gameTimeTicksAtom), []))
    const groupRef = useRef<Group>(null!)
    const speed = useModule(SpeedModule, id)
    useFrame(() => {
        const yPos =
            Math.abs(Math.sin(readCurrentTime() * speed * BOUNCE_SPEED_MULTIPLIER)) *
            BOUNCE_HEIGHT_MULTIPLIER
        const amountUnder = Math.min(0, yPos - BODY_DIAMETER / 2)
        if (amountUnder === 0) {
            groupRef.current.position.y = yPos
            groupRef.current.scale.set(1, 1, 1)
        } else {
            // TODO: Make the scale do a little reactive wobble while bubble is in the air too
            // Maybe use real physics for this but the effect is pretty good anyway
            const vScale = (BODY_DIAMETER + amountUnder) / BODY_DIAMETER
            const hScale = Math.sqrt(1 / vScale)

            // BODY_DIAMETER * vScale = (BODY_DIAMETER + amountUnder)

            groupRef.current.scale.set(hScale, vScale, hScale)
            groupRef.current.position.y = yPos - amountUnder / 2
        }
    })
    return (
        <group ref={groupRef}>
            <Ball size={BODY_DIAMETER} material={BODY_MATERIAL} />
        </group>
    )
}

const DEATH_LENGTH = 2
const DROP_DISTANCE = 1.5

export const BubbleCorpseRender = ({ id }: ActorProps) => {
    // const readCurrentTime = useAtomCallback(useCallback((get) => get(gameTimeTicksAtom), []))
    const groupRef = useRef<Group>(null!)
    // TODO: We're replicating all this stuff so we can get the corpse at the exact same height
    // the bubble was when it died. Would be good if we can store the height somewhere instead
    // or otherwise transfer that info over on corpse creation so we don't have to do this.
    const speed = useModule(SpeedModule, id)
    const [actor] = useActor(id)
    const setActor = useSetAtom(actorFamily(id))
    const readCurrentTime = useAtomCallback(useCallback((get) => get(gameTimeTicksAtom), []))

    useFrame(() => {
        groupRef.current.position.y =
            Math.abs(Math.sin(actor.created * speed * BOUNCE_SPEED_MULTIPLIER)) *
            BOUNCE_HEIGHT_MULTIPLIER
        // Animation finished, destroy corpse
        if (actor.created + DEATH_LENGTH < readCurrentTime()) {
            setActor({ type: "destroy" })
        }
    })

    const drops = useMemo(() => {
        const drops = []

        for (let n = -9; n < 8; n++) {
            for (let m = -9; m < 8; m++) {
                drops.push([(n + 1) / 9, (m + 1) / 9, 0] as const)
            }
        }
        return drops
    }, [])

    // TODO: Switch to instancing to make a shitload of drops. Maybe use a world-level system for particles/blood drops
    // (and splatter on the floor with decals).
    // Should prob not affect other items with physics.

    return (
        <group ref={groupRef}>
            <Ball size={0.8} visible={false}>
                {drops.map((d) => (
                    // TODO: To work with instancing we'd have to approach this differently; need a component
                    // inside the Ball's context and calculate the surface positions once. Would be better
                    // for calcing the linearVelocity anyway.
                    <Position at={d}>
                        <RigidBody linearVelocity={d}>
                            <mesh>
                                <sphereGeometry args={[0.05, 8, 8]} />
                                {BODY_MATERIAL}
                            </mesh>
                        </RigidBody>
                    </Position>
                ))}
            </Ball>
        </group>
    )
}

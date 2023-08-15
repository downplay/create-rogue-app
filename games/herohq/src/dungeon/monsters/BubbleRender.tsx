import { useCallback, useEffect, useMemo, useRef } from "react"
import { Ball, Position } from "../../3d/Parts"
import { makeToonMaterial } from "../../3d/materials"
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
import { Group, Vector3 } from "three"
import { useAtomValue, useSetAtom } from "jotai"

const BODY_MATERIAL = makeToonMaterial(0.6, 0.6, 0.03)
const BODY_MATERIAL_SELECTED = makeToonMaterial(0.4, 0.7, 0.2)

const BOUNCE_SPEED_MULTIPLIER = 3
const BOUNCE_HEIGHT_MULTIPLIER = 0.5

export const BubbleRender = ({ id, selected }: ActorProps) => {
    // const movement = useModule(MovementModule, id)
    // const animate = movement.status === "moving"
    // const currentTime = useAtomRef(gameTimeTicksAtom)
    const readCurrentTime = useAtomCallback(useCallback((get) => get(gameTimeTicksAtom), []))
    const groupRef = useRef<Group>(null!)
    const speed = useModule(SpeedModule, id)
    useFrame(() => {
        groupRef.current.position.y =
            Math.abs(Math.sin(readCurrentTime() * speed * BOUNCE_SPEED_MULTIPLIER)) *
            BOUNCE_HEIGHT_MULTIPLIER
    })
    return (
        <group ref={groupRef}>
            <Ball size={0.8} material={selected ? BODY_MATERIAL_SELECTED : BODY_MATERIAL} />
        </group>
    )
}

const DEATH_LENGTH = 0.5
const DROP_DISTANCE = 1

export const BubbleCorpseRender = ({ id }: ActorProps) => {
    const readCurrentTime = useAtomCallback(useCallback((get) => get(gameTimeTicksAtom), []))
    const groupRef = useRef<Group>(null!)
    // TODO: We're replicating all this stuff so we can get the corpse at the exact same height
    // the bubble was when it died. Would be good if we can store the height somewhere instead
    // or otherwise transfer that info over on corpse creation so we don't have to do this.
    const speed = useModule(SpeedModule, id)
    const [actor] = useActor(id)
    const setActor = useSetAtom(actorFamily(id))

    useFrame(() => {
        groupRef.current.position.y =
            Math.abs(Math.sin(readCurrentTime() * speed * BOUNCE_SPEED_MULTIPLIER)) *
            BOUNCE_HEIGHT_MULTIPLIER
    })

    const drops = useMemo(() => {
        const drops = []
        for (let n = 0; n < 8; n++) {
            for (let m = 0; m < 8; m++) {
                drops.push([(n + 1) / 9, (m + 1) / 9, 0] as const)
            }
        }
        return drops
    }, [])

    const currentTime = useAtomValue(gameTimeTicksAtom)

    const dropPosition = useMemo(() => {
        return new Vector3(0, 0, (-(currentTime - actor.created) * DROP_DISTANCE) / DEATH_LENGTH)
    }, [currentTime, actor, actor.created])

    // TODO: Find a way to make this a useFrame pattern
    // TODO: Well, actually use instancing + physics to display a shitload of droplets real fast

    useEffect(() => {
        // Animation finished, destroy corpse
        if (actor.created + DEATH_LENGTH < currentTime) {
            setActor({ type: "destroy" })
        }
    }, [currentTime, actor.created])

    return (
        <group ref={groupRef}>
            <Ball size={0.8} visible={false}>
                {drops.map((d) => (
                    <Position at={d}>
                        <mesh position={dropPosition}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            {BODY_MATERIAL}
                        </mesh>
                    </Position>
                ))}
            </Ball>
        </group>
    )
}

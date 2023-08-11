import { useCallback, useRef } from "react"
import { gameTimeTicksAtom } from "../../model/game"
import { Ball } from "../../3d/Parts"
import { makeToonMaterial } from "../../3d/materials"
import { ActorProps, SpeedModule, useModule } from "../../model/actor"
import { useFrame } from "@react-three/fiber"
import { useAtomCallback } from "jotai/utils"
import { Group } from "three"

const BODY_MATERIAL = makeToonMaterial(0.6, 0.6, 0.03)

const BOUNCE_SPEED_MULTIPLIER = 3
const BOUNCE_HEIGHT_MULTIPLIER = 6

export const BubbleRender = ({ id }: ActorProps) => {
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
            <Ball size={5} material={BODY_MATERIAL} />
        </group>
    )
}

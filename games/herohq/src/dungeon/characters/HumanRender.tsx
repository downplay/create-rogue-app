import { useEffect, useMemo, useRef } from "react"
import { Ball, ORIGIN, Position, PositionRef, Rod } from "../../3d/Parts"
import { Mesh, PointLight, PointLightShadow, Vector3 } from "three"
import { makeToonMaterial } from "../../3d/materials"
import { useAtomValue } from "jotai"
import { ActorProps, gameTimeTicksAtom, useModule } from "../../model/actor"
import { MovementModule } from "../../model/movement"
import { createPortal, useFrame, useThree } from "@react-three/fiber"

const NeckPosition = new Vector3(0, 0, 0)

const SKIN_MATERIAL = makeToonMaterial(0, 0.4, 0.5)
const BODY_MATERIAL = makeToonMaterial(0.5, 0.1, 0.1)
const LEG_MATERIAL = makeToonMaterial(0.66, 0.4, 0.3)

const CYCLE_SPEED = 1

const LANTERN_POS = [0, 0.2, 1] as const

export const HumanRender = ({ id }: ActorProps) => {
    const movement = useModule(MovementModule, id)
    const animate = movement.status === "moving"
    const time = useAtomValue(gameTimeTicksAtom)
    const cycle = time * CYCLE_SPEED // * speed
    const three = useThree()
    const portalTarget = three.scene

    const bodySize = useMemo(() => [0.15, 0.4, 0.05] as const, [])
    const neckLength = useMemo(() => 0.05, [])
    const neckRadius = useMemo(() => 0.05, [])
    const headSize = useMemo(() => 0.15, [])
    // TODO: It seems like Left and Right are mixed up. Probably we don't understand z axis. Will need to fix
    // this and go through a load of things again!
    const arms = useMemo(
        () => [
            {
                tag: "Arm:1",
                handed: "Left",
                position: [-0.25, 0, 0] as const,
                shoulder: [-0.3, -0.5, 0] as const,
                elbow: [-0.2, 0, 0] as const
            },
            {
                tag: "Arm:2",
                handed: "Right",
                position: [0.25, 0, 0] as const,
                shoulder: [0.3, 0.5, 0] as const,
                elbow: [0.2, 0, 0] as const
            }
        ],
        []
    )
    const legs = useMemo(
        () => [
            {
                tag: "Leg:1",
                handed: "Left",
                position: [-0.8, 0, 0] as const,
                hip: [-0.2, -0.2 + (animate ? 0.4 * Math.sin(cycle * Math.PI * 2) : 0), 0] as const,
                knee: [0, 0.4 + (animate ? 0.2 * Math.sin(cycle * Math.PI * 2) : 0), 0] as const
            },
            {
                tag: "Leg:2",
                handed: "Right",
                position: [0.8, 0, 0] as const,
                hip: [
                    0.2,
                    -0.2 + (animate ? 0.4 * Math.sin((cycle + 0.5) * Math.PI * 2) : 0),
                    0
                ] as const,
                knee: [
                    0,
                    0.4 + (animate ? 0.2 * Math.sin((cycle + 0.5) * Math.PI * 2) : 0),
                    0
                ] as const
            }
        ],
        [cycle]
    )
    // TODO: If we base offset on the legs position or the cycle we can get some bobbing
    const offset = useMemo(() => [0, 0.42, 0] as const, [])
    /* // TODO: We need a kind of slot-fill system where the hands/legs can be given a
        <Slot /> component and name and via a context we can attach accessories to it */

    // TODO: Hoisting a position out to world space seems like a pattern we should
    // be able to reuse (and will need to if this fixes the lighting issue)
    const lanternPositionRef = useRef<Vector3>()
    const lanternRef = useRef<PointLight>(null!)
    const lanternContainerRef = useRef<Mesh>(null!)
    useEffect(() => {
        if (lanternRef.current) {
            lanternRef.current.shadow.camera.near = 0.01
        }
    }, [lanternRef.current])
    useFrame(() => {
        if (lanternPositionRef.current && lanternRef.current && lanternContainerRef.current) {
            console.log(
                new Vector3(
                    lanternPositionRef.current.x,
                    lanternPositionRef.current.y,
                    lanternPositionRef.current.z
                )
            )
            const local = lanternContainerRef.current.worldToLocal(
                new Vector3(
                    lanternPositionRef.current.x,
                    lanternPositionRef.current.y,
                    lanternPositionRef.current.z
                )
            )
            // console.log("LOCAL", local)
            lanternRef.current.position.x = local.x
            lanternRef.current.position.y = local.y
            lanternRef.current.position.z = local.z
            lanternContainerRef.current.position.x = 0
            lanternContainerRef.current.position.y = 0
            lanternContainerRef.current.position.z = 0
        }
    })

    return (
        <>
            <mesh ref={lanternContainerRef}>
                <pointLight ref={lanternRef} color="lightyellow" castShadow intensity={10} />
            </mesh>
            <group position={offset}>
                <Ball size={bodySize} material={BODY_MATERIAL}>
                    <Position at={NeckPosition}>
                        <Rod length={neckLength} caps={neckRadius} material={SKIN_MATERIAL}>
                            <Position at={NeckPosition}>
                                <Ball size={headSize} material={SKIN_MATERIAL} />
                            </Position>
                        </Rod>
                    </Position>
                    {arms.map((arm) => (
                        <Position key={arm.tag} at={arm.position}>
                            <Rod
                                length={0.14}
                                caps={0.02}
                                rotate={arm.shoulder}
                                material={BODY_MATERIAL}>
                                <Position at={0}>
                                    <Rod
                                        length={0.17}
                                        caps={0.02}
                                        rotate={arm.elbow}
                                        material={BODY_MATERIAL}>
                                        <Position at={0}>
                                            <Ball size={0.05} material={SKIN_MATERIAL}>
                                                {arm.handed === "Left" && (
                                                    // Holding a torch here; we will track position
                                                    // and place the light at a higher level otherwise
                                                    // it can't cast shadows on its own parents
                                                    <PositionRef
                                                        ref={lanternPositionRef}
                                                        at={LANTERN_POS}
                                                    />
                                                )}
                                            </Ball>
                                        </Position>
                                    </Rod>
                                </Position>
                            </Rod>
                        </Position>
                    ))}
                    {legs.map((leg) => (
                        <Position key={leg.tag} at={leg.position}>
                            <Rod length={0.14} caps={0.02} rotate={leg.hip} material={LEG_MATERIAL}>
                                <Position at={0}>
                                    <Rod
                                        length={0.17}
                                        caps={0.02}
                                        rotate={leg.knee}
                                        material={LEG_MATERIAL}
                                    />
                                </Position>
                            </Rod>
                        </Position>
                    ))}
                </Ball>
            </group>
        </>
    )
}

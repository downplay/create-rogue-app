import { useMemo } from "react"
import { Ball, Position, Rod } from "../../3d/Parts"
import { Vector3 } from "three"
import { makeToonMaterial } from "../../3d/materials"

const NeckPosition = new Vector3(0, 0, 0)

const SKIN_MATERIAL = makeToonMaterial(0, 0.4, 0.5)
const BODY_MATERIAL = makeToonMaterial(0.5, 0.1, 0.1)
const LEG_MATERIAL = makeToonMaterial(0.66, 0.4, 0.3)

export const HumanRender = ({ id }: { id: string }) => {
    const bodySize = useMemo(() => [1.5, 4, 0.5] as const, [])
    const neckLength = useMemo(() => 0.5, [])
    const neckRadius = useMemo(() => 0.5, [])
    const headSize = useMemo(() => 1.5, [])
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
                hip: [-0.2, 0.1, 0] as const,
                knee: [0, 0.4, 0] as const
            },
            {
                tag: "Leg:2",
                handed: "Right",
                position: [0.8, 0, 0] as const,
                hip: [0.2, -0.4, 0] as const,
                knee: [0, 0.5, 0] as const
            }
        ],
        []
    )
    // TODO: If we base offset on the legs position or the cycle we can get some bobbing
    const offset = useMemo(() => [0, 4.2, 0] as const, [])
    return (
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
                        {/* // TODO: We need a kind of slot-fill system where the hand can be given a
                    <Slot /> component and name and via a context we can attach accessories to it */}
                        <Rod length={1.4} caps={0.2} rotate={arm.shoulder} material={BODY_MATERIAL}>
                            <Position at={0}>
                                <Rod
                                    length={1.7}
                                    caps={0.2}
                                    rotate={arm.elbow}
                                    material={BODY_MATERIAL}>
                                    <Position at={0}>
                                        <Ball size={0.5} material={SKIN_MATERIAL}>
                                            {arm.handed === "Left" && (
                                                // Holding a torch here
                                                <Position at={0}>
                                                    <pointLight color="lightyellow" castShadow />
                                                </Position>
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
                        {/* // TODO: We need a kind of slot-fill system where the hand can be given a
                    <Slot /> component and name and via a context we can attach accessories to it */}
                        <Rod length={1.4} caps={0.2} rotate={leg.hip} material={LEG_MATERIAL}>
                            <Position at={0}>
                                <Rod
                                    length={1.7}
                                    caps={0.2}
                                    rotate={leg.knee}
                                    material={LEG_MATERIAL}
                                />
                            </Position>
                        </Rod>
                    </Position>
                ))}
            </Ball>
        </group>
    )
}

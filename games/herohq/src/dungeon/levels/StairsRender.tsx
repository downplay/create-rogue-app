import { RigidBody } from "@react-three/rapier"
import { useMemo } from "react"
import { makeToonMaterial } from "../../3d/materials"

const STAIRS_MATERIAL = makeToonMaterial(0, 0.5, 0.5)

export const UpStairsRender = () => {
    // const body = useMemo(() => {})

    const stairs = useMemo(() => {
        const result = []
        for (let n = 0; n < 10; n++) {
            result.push(
                <mesh position={[0.1 * n, 0.1 * n, 0]}>
                    <boxGeometry args={[0.1, 0.1, 1]} />
                    {STAIRS_MATERIAL}
                </mesh>
            )
        }
        return result
    }, [])
    return <RigidBody type="fixed">{stairs}</RigidBody>
}

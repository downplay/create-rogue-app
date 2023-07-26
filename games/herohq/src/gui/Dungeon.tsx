import { Canvas } from "@react-three/fiber"
import { BugRender } from "../monsters/BugRender"
import { useVector } from "./hooks"
import { Euler, Matrix4, Vector3 } from "three"
import { useMemo } from "react"
import { OrbitControls } from "@react-three/drei"
import { PedeRender } from "../monsters/PedeRender"

const ORIGIN = new Vector3(0, 0, 0)
const UP = new Vector3(0, 1, 0)

const DEFAULT_CAMERA = {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [-10, 20, -50]
}

export const Dungeon = () => {
    // const hero = useAtom(activeHeroAtom)
    // const dungeon = useAtom(dungeonAtom)
    const lightPosition = useVector(10, 10, -10)
    // const cameraPosition = useVector(-5, 10, -20)
    // const cameraRotation = useMemo(() => {
    //     const m = new Matrix4().lookAt(cameraPosition, ORIGIN, UP)
    //     return new Euler().setFromRotationMatrix(m)
    // }, [cameraPosition])
    return (
        <Canvas camera={DEFAULT_CAMERA}>
            <OrbitControls />
            <pointLight position={lightPosition} />
            <ambientLight intensity={0.5} />
            {/* <perspectiveCamera position={cameraPosition} rotation={cameraRotation} /> */}
            <PedeRender id="Monster:Bug:1" />
        </Canvas>
    )
}

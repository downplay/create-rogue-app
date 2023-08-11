import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Room } from "../dungeon/levels/Room"
import { Quad } from "../model/dungeon"
import { BugRender } from "../dungeon/monsters/BugRender"
import { useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { Hero } from "../dungeon/Hero"
import { Actor } from "../dungeon/Actor"
import { useMemo } from "react"

// const ORIGIN = new Vector3(0, 0, 0)
// const UP = new Vector3(0, 1, 0)

const DEFAULT_CAMERA = {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [-10, 20, 50] as const
}

const DEFAULT_ROOM: Quad = { x: -5, y: -5, width: 10, height: 10 }

// const ROTATE_Y_180 = new Euler(0, Math.PI, 0)

export const Dungeon = () => {
    // const hero = useAtom(activeHeroAtom)
    // const dungeon = useAtom(dungeonAtom)
    // const lightPosition = useVector(10, 10, 20)
    // const cameraPosition = useVector(-5, 10, -20)
    // const cameraRotation = useMemo(() => {
    //     const m = new Matrix4().lookAt(cameraPosition, ORIGIN, UP)
    //     return new Euler().setFromRotationMatrix(m)
    // }, [cameraPosition])
    const heroId = useAtomValue(activeHeroIdAtom)
    // TODO: How do we manage which monsters are being rendered/updated?
    // For now it's simple enough to only handle monsters in same room as hero and freeze everything
    // else, but we might want to still animate monsters in other rooms and occasionally have them
    // walk through an open door.
    const actors = useAtomValue(actorsAtom)
    return (
        <Canvas camera={DEFAULT_CAMERA} shadows>
            <OrbitControls />
            <ambientLight intensity={0.1} />
            {/* <perspectiveCamera position={cameraPosition} rotation={cameraRotation} /> */}
            {/* <PedeRender id="Monster:Bug:1" /> */}
            <Room id="Room:1" area={DEFAULT_ROOM} />
            {/* <BugRender id="Monster:Bug:1" /> */}
            {/* // TODO: We might want to distinguish between dynamic actors vs static scenery // as we
            can optimise for things that aren't really going to move */}
            {actors.map((m) => (
                <Actor id={m} />
            ))}
            {heroId && <Hero id={heroId} />}
        </Canvas>
    )
}

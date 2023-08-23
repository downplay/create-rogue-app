import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { Selection, EffectComposer, Outline } from "@react-three/postprocessing"
import { Physics } from "@react-three/rapier"

import { Room } from "../dungeon/levels/Room"
import { dungeonAtom } from "../model/dungeon"
import { atom, useAtom, useAtomValue } from "jotai"
import { Actor } from "../dungeon/Actor"
import { Suspense, useEffect } from "react"
import { FollowCamera } from "../3d/FollowCamera"
import { atomFamily } from "jotai/utils"
import { LocationData, actorIdsAtom } from "../model/actor"

// https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#re-using-geometries-and-materials
THREE.ColorManagement.enabled = true

// const ORIGIN = new Vector3(0, 0, 0)
// const UP = new Vector3(0, 1, 0)

const DEFAULT_CAMERA = {
    fov: 45,
    near: 1,
    far: 1000,
    position: [10, 20, 50] as const
    // rotation: [0.25 * Math.PI, 0, 0] as const
}

// const ROTATE_Y_180 = new Euler(0, Math.PI, 0)

export const visibleActorIdsFamily = atomFamily((location: string) =>
    atom((get) => {
        // TODO:
        return get(actorIdsAtom).filter((id) => get(LocationData.family(id)).location === location)
    })
)

export const Dungeon = ({ location }: { location: string }) => {
    // const hero = useAtom(activeHeroAtom)
    // const dungeon = useAtom(dungeonAtom)
    // const lightPosition = useVector(10, 10, 20)
    // const cameraPosition = useVector(-5, 10, -20)
    // const cameraRotation = useMemo(() => {
    //     const m = new Matrix4().lookAt(cameraPosition, ORIGIN, UP)
    //     return new Euler().setFromRotationMatrix(m)
    // }, [cameraPosition])
    // const heroId = useAtomValue(activeHeroIdAtom)
    // TODO: How do we manage which monsters are being rendered/updated?
    // For now it's simple enough to only handle monsters in same room as hero and freeze everything
    // else, but we might want to still animate monsters in other rooms and occasionally have them
    // walk through an open door.
    const [dungeon, setDungeon] = useAtom(dungeonAtom)
    const actors = useAtomValue(visibleActorIdsFamily(location))
    // console.log(dungeon.rooms)
    useEffect(() => {
        setDungeon({ type: "initialize", level: 1 })
    }, [])

    // useFrame((e) => {
    //     e.events.handlers?.onPointerMove({target})
    // })

    /* // TODO: We might want to distinguish between dynamic actors vs static scenery // as we
            can optimise for things that aren't really going to move */
    return (
        <Canvas camera={DEFAULT_CAMERA} shadows>
            <Suspense>
                <Physics>
                    <FollowCamera />
                    <ambientLight intensity={0.1} />
                    {dungeon.rooms.map((r) => (
                        <Room key={r.id} id={r.id} area={r.area} />
                    ))}
                    <Selection>
                        <EffectComposer multisampling={8} autoClear={false}>
                            <Outline
                                blur
                                visibleEdgeColor="white"
                                edgeStrength={100}
                                width={1000}
                            />
                        </EffectComposer>
                        {actors.map((m) => (
                            <Actor id={m} key={m} />
                        ))}
                    </Selection>
                </Physics>
            </Suspense>
        </Canvas>
    )
}

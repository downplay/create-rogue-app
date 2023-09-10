import { useSetAtom } from "jotai"
import { useModule, LocationModule, useData } from "../../model/actor"
import { Quad } from "../../model/spacial"
import { heroControlAtom } from "../../model/hero"
import { useCallback, useMemo } from "react"
import { Vector3 } from "three"
import { ThreeEvent } from "@react-three/fiber"
import { useTextureMaterial } from "../../3d/materials"
import {
    Tile1Texture,
    Tile2Texture,
    Tile3Texture,
    Tile4Texture,
    Tile5Texture,
    Tile6Texture
} from "../../3d/textures/bricks"
import { RigidBody } from "@react-three/rapier"
import { TextureIndexData } from "./FloorTile"

const Textures = [
    Tile1Texture,
    Tile2Texture,
    Tile3Texture,
    Tile4Texture,
    Tile5Texture,
    Tile6Texture
]

// TODO: BIG todo. Would be much more efficient to combine together all floor tiles in the map
// and draw geometry by hand for the entire floor.

export const Floor = ({ area, textureIndex = 0 }: { area: Quad; textureIndex?: number }) => {
    // TODO: It's a bit non-standard to do this in the renderer rather than a module
    // with interaction but it was already this way since floors weren't actors then. Seems ok
    // for now but we do also need to display a reticule on the floor
    const setHeroControl = useSetAtom(heroControlAtom)

    const boxArgs = useMemo(() => [area.width, 1, area.height] as [number, number, number], [area])
    const boxPosition = useMemo(
        () => new Vector3(area.x + area.width / 2, -0.5, area.y + area.height / 2),
        [area]
    )

    const handleClick = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            const gameX = e.point.x
            const gameY = e.point.z
            setHeroControl({
                type: "WalkTo",
                target: { x: gameX, y: gameY }
            })
        },
        [setHeroControl]
    )

    const material = useTextureMaterial(Textures[textureIndex])

    // TODO: Handle mouse move etc events and display a target
    return (
        <RigidBody type="fixed">
            <mesh position={boxPosition} receiveShadow onClick={handleClick}>
                <boxGeometry args={boxArgs} />
                {material}
            </mesh>
        </RigidBody>
    )
}

export const FloorRender = ({ id }: { id: string }) => {
    // Note: Ignoring mode since this shouldn't ever be in the inventory unless we make a builder game
    const location = useModule(LocationModule, id)
    const area = useMemo(
        () => ({
            x: location.position.x,
            y: location.position.y,
            width: 1,
            height: 1
        }),
        [location]
    )
    const textureIndex = useData(TextureIndexData, id)

    return <Floor area={area} textureIndex={textureIndex} />
}

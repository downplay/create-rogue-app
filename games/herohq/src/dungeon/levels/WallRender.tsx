import { useMemo } from "react"
import { Quad } from "../../model/spacial"
import { Vector3 } from "three"
import { useTextureMaterial } from "../../3d/materials"
import { RigidBody } from "@react-three/rapier"
import {
    Brick1Texture,
    Brick2Texture,
    Brick3Texture,
    Brick4Texture
} from "../../3d/textures/bricks"
import { LocationModule, useData, useModule } from "../../model/actor"
import { TextureIndexData } from "./tile"

const Textures = [Brick1Texture, Brick2Texture, Brick3Texture, Brick4Texture]

export const WallMerged = ({ area, textureIndex = 0 }: { area: Quad; textureIndex?: number }) => {
    const boxArgs = useMemo(() => [area.width, 1, area.height] as [number, number, number], [area])
    const boxPosition = useMemo(
        () => new Vector3(area.x + area.width / 2, 0.5, area.y + area.height / 2),
        [area]
    )
    const material = useTextureMaterial(Textures[textureIndex])

    return (
        <RigidBody type="fixed">
            <mesh position={boxPosition} receiveShadow>
                <boxGeometry args={boxArgs} />
                {material}
            </mesh>
        </RigidBody>
    )
}

export const Wall = ({ area, textureIndex = 0 }: { area: Quad; textureIndex?: number }) => {
    const boxArgs = useMemo(() => [area.width, 1, area.height] as [number, number, number], [area])
    const boxPosition = useMemo(
        () => new Vector3(area.x + area.width / 2, 0.5, area.y + area.height / 2),
        [area]
    )

    const material = useTextureMaterial(Textures[textureIndex])

    return (
        <RigidBody type="fixed">
            <mesh position={boxPosition} receiveShadow>
                <boxGeometry args={boxArgs} />
                {material}
            </mesh>
        </RigidBody>
    )
}

export const WallRender = ({ id }: { id: string }) => {
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

    return <Wall area={area} textureIndex={textureIndex} />
}

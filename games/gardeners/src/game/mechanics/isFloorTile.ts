import { Mesh, PlaneBufferGeometry, PlaneGeometry } from "three"
import { getGlobalInstance } from "../../engine/global"
import { hasRootNode } from "../../with-three/hasRootNode"
import { GlobalMaterialManager } from "../../with-three/MaterialManager"

export const isFloorTile = (...paths: string[]) => {
    const materials = getGlobalInstance(GlobalMaterialManager)
    const material = materials.interface.getMeshBasic({
        name: paths[0],
        sprites: paths
    })
    const node = hasRootNode()
    const geometry = new PlaneGeometry(1, 1, 1, 1)

    const plane = new Mesh(geometry, material)
    // plane.position.y = 0.0
    plane.rotateX(-Math.PI / 2)
    node.add(plane)
}

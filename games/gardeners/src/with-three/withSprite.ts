import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
import { hasRootNode } from "./hasRootNode"

export const withSprite = () => {
    console.log("adding sprite")
    const node = hasRootNode()
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new Mesh(geometry, material)
    node.add(cube)
}

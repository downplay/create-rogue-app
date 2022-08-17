import { AmbientLight } from "three"
import { hasRootNode } from "./hasRootNode"

export const hasLight = () => {
    const light = new AmbientLight(0xffffff, 1.0)
    const node = hasRootNode()
    // light.position.y = 5
    node.add(light)
    // scene.add(light)
}

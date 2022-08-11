import { Object3D, Vector3 } from "three"
import { onSceneCreate, onSceneRender } from "./GameCanvas"

export const hasRootNode = () => {
    // TODO: Let node be a ref? (So it can be shared between callings of this hook)
    // It doesn't need to be data
    // Or is there a way to prevent multiple callings of some hooks, just repeat
    // the return
    let node: Object3D = new Object3D()
    // TODO: implement hasPosition,
    // subscribe to position updates & update the node accordingly
    // const position = getPosition()
    // node.position.set(position.x,0,position.y)
    onSceneCreate(({ scene /*, parent */ }) => {
        console.log("scene creating")
        // TOOD: Parent linkage, it's pretty awkward
        // We just possibly need hasRootNode on everything
        // if (parent) {

        // }
        scene.add(node)
    })
    return node
}

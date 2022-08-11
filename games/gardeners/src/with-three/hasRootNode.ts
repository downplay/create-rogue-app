import { Object3D, Vector3 } from "three"
import { dispatchAction, getSelf } from "../engine/entity"
import { CREATE_SCENE, onSceneCreate, onSceneRender } from "./GameCanvas"

export const hasRootNode = () => {
    const me = getSelf()
    // TODO: Let node be a ref? (So it can be shared between callings of this hook)
    // It doesn't need to be data
    // Or is there a way to prevent multiple callings of some hooks, just repeat
    // the return
    let node: Object3D = new Object3D()
    let initialized = false
    // TODO: implement hasPosition,
    // subscribe to position updates & update the node accordingly
    // const position = getPosition()
    // node.position.set(position.x,0,position.y)
    onSceneCreate(({ scene /*, parent */ }) => {
        console.log("root node create")
        initialized = true
        // TOOD: Parent linkage, it's pretty awkward
        // We just possibly need hasRootNode on everything
        // if (parent) {

        // }
        scene.add(node)
    })
    onSceneRender((payload) => {
        console.log("root node render")
        // TODO: Seems weird and unneccesary but it'll fix things right now
        if (!initialized) {
            dispatchAction(me, CREATE_SCENE, payload)
        }
    })
    return node
}

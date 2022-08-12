import { Object3D, Vector3 } from "three"
import { onDestroy } from "../engine/action"
import { dispatchAction, getSelf } from "../engine/entity"
import { hasPosition } from "../game/mechanics/hasPosition"
import {
    CREATE_SCENE,
    DESTROY_SCENE,
    onSceneCreate,
    onSceneRender,
    SceneActionPayload
} from "./GameCanvas"

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
    const [position] = hasPosition()
    // node.position.set(position.x,0,position.y)
    // TODO: Honestly there is a much better way to trigger scene create/update/destroy
    // create/destroy should be triggered when adding as a child, when the parent
    // is available ... we get the THREE node from the parent whether it's a Scene
    // or a aObject3D ... camera will be a separate withCameraControl or something
    // for times we want the camera to track an entity or apply e.g. camera wobble
    let currentPayload: SceneActionPayload
    onSceneCreate((payload) => {
        currentPayload = payload
        const { scene /*, parent */ } = payload

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
        node.position.set(position.value.x, position.value.y, position.value.z)
    })
    onDestroy(() => {
        if (initialized) {
            dispatchAction(me, DESTROY_SCENE, currentPayload)
        }
    })
    return node
}

import { Vector, Vector3, VECTOR3_ORIGIN } from "@hero/math"
import { Object3D } from "three"
import { hasRootNode } from "../with-three/hasRootNode"
import { defineAction, dispatchAction, onAction } from "./action"
import { defineData, hasData } from "./data"
import { getSelf } from "./entity"
import { EntityInstance } from "./types"

// TODO: Maybe it's enough for now but as we go further we might find we need more and more
// data hanging off this connection and maybe it should be a full entity or some other modular
// way to attach data to the parent/child
// This would also
export type ChildInstance = {
    instance: EntityInstance<any, any>
    position: Vector3
    rotation: Vector3
}

type AttachParentPayload = {
    parent: EntityInstance<any, any>
    node: Object3D
}

export const ATTACH_PARENT = defineAction<AttachParentPayload>("ATTACH_PARENT")

export const onAttachParent = (handler: (payload: AttachParentPayload) => void) => {
    onAction(ATTACH_PARENT, handler)
}

const ChildrenData = defineData<ChildInstance[]>("Entity_Children")

export const hasChildren = () => {
    const [children, updateChildren] = hasData(ChildrenData, [])
    const node = hasRootNode()
    const me = getSelf()

    const add = (
        child: EntityInstance<any, any>,
        position: Vector | Vector3 = VECTOR3_ORIGIN,
        rotation: Vector | Vector3 = VECTOR3_ORIGIN
    ) => {
        updateChildren((children) => [...children, { instance: child, position, rotation }])
        // Create a child node to handle the position/rotation transform
        const childNode = new Object3D()
        childNode.position.set(position.x, position.y, "z" in position ? position.z : 0)
        childNode.rotation.set(rotation.x, rotation.y, "z" in rotation ? rotation.z : 0)
        node.add(childNode)
        dispatchAction(child, ATTACH_PARENT, { parent: me, node: childNode })
    }

    const remove = (child: EntityInstance<any, any>) => {
        updateChildren((children) => children.filter((c) => c.instance !== child))
    }

    return {
        children,
        add,
        remove
    }
}

// produce version:

// const add = (child: EntityInstance<any, any>) => {
//     updateChildren((children) => {
//         children.push(child)
//     })
// }

// const remove = (child: EntityInstance<any, any>) => {
//     const index = children.value.indexOf(child)
//     if (index > -1) {
//         updateChildren((children) => {
//             children.splice(index, 1)
//         })
//     }
// }

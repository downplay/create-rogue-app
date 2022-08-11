import { defineData, hasData } from "./data"
import { EntityInstance } from "./types"

const ChildrenData = defineData<EntityInstance<any, any>[]>("Entity_Children")

export const hasChildren = () => {
    const [children, updateChildren] = hasData(ChildrenData, [])

    const add = (child: EntityInstance<any, any>) => {
        updateChildren((children) => {
            children.push(child)
        })
    }

    const remove = (child: EntityInstance<any, any>) => {
        const index = children.value.indexOf(child)
        if (index > -1) {
            updateChildren((children) => {
                children.splice(index, 1)
            })
        }
    }
    return {
        add,
        remove
    }
}

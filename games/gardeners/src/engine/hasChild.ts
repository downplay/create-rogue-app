import { onCreate } from "./action"
import { defineData, hasData } from "./data"
import { getEngine } from "./entity"
import { hasChildren } from "./hasChildren"
import { EntityInstance, EntityType } from "./types"

const NamedChildInstancesData = defineData<Record<string, EntityInstance>>("NamedChildInstances")

export const hasChild = <T extends {} = {}, I = {}>(
    name: string,
    template: EntityType<T, I> | string,
    props: T = {} as T
) => {
    const { add, remove } = hasChildren()
    const engine = getEngine()
    const [instances, update] = hasData(NamedChildInstancesData, () => ({}))
    onCreate(() => {
        if (name in instances.value) {
            throw new Error("Child instance name must be unique: " + name)
        }
        const created = engine.entities.create(template, props)
        update((instances) => ({
            ...instances,
            [name]: created
        }))
        add(created)
    })
    // TODO: Should we return a pair with a destroy function
    // or handle an onDestroy event instead?
    return instance
}

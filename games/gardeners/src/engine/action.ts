import { getEntityContext } from "./entity"
import { ChildInstance } from "./hasChildren"
import { ActionContext, ActionDefinition, EntityInstance } from "./types"

type ActionOptions = {
    cascade?: boolean
    bubble?: boolean
}

export const defineAction = <T, O = void>(
    name: string,
    options: ActionOptions = {}
    // idGetter?: (payload: T) => string
): ActionDefinition<T, O> => {
    return { name, ...options }
}

export const DESTROY_ENTITY = defineAction("DESTROY_ENTITY")
export const CREATE_ENTITY = defineAction("CREATE_ENTITY")
// TODO: Should not really be a cascade, should just run on all entities with
// handlers every frame ... maybe global:true rather than cascade:true ... will
// be more efficient
export const UPDATE_ENTITY = defineAction("UPDATE_ENTITY", { cascade: true })

export const onAction = <T, O = void>(
    action: ActionDefinition<T, O>,
    handler: (payload: T) => O
) => {
    const context = getEntityContext()
    context.actions[action.name] = context.actions[action.name] || []
    context.actions[action.name].push(handler)
}

export const onCreate = (handler: () => void) => {
    onAction(CREATE_ENTITY, handler)
}

export const onDestroy = (handler: () => void) => {
    onAction(DESTROY_ENTITY, handler)
}

export const onUpdate = (handler: () => void) => {
    onAction(UPDATE_ENTITY, handler)
}

export const dispatchAction = <P, O>(
    instance: EntityInstance<any, any>,
    action: ActionDefinition<P, O>,
    payload: P
): O[] => {
    const actions = instance.entity.actions[action.name] || []
    const actionContext: ActionContext = {
        engine: instance.entity.engine,
        target: instance
    }
    const results = actions.map((h) => h(payload, actionContext))
    if (action.cascade) {
        // TODO: Need a helper for acccessing data arbitrarily, also as a hook
        // which can be reactive
        // TODO: This is a bad way to cascade actions, we should have a WILDECARD
        const children =
            (instance.entity.localData["Entity_Children"]?.data
                .value as unknown as ChildInstance[]) || []
        return results.concat(
            children.map((child) => dispatchAction(child.instance, action, payload)).flat()
        )
    }
    return results
}

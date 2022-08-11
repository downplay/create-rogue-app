import { getEntityContext } from "./entity"
import { ActionDefinition } from "./types"

type ActionOptions = {
    cascade?: boolean
    bubble?: boolean
}

export const defineAction = <T, O = T>(
    name: string,
    options: ActionOptions = {}
    // idGetter?: (payload: T) => string
): ActionDefinition<T, O> => {
    return { name, ...options }
}

export const DESTROY_ENTITY = defineAction("DESTROY_ENTITY")
export const CREATE_ENTITY = defineAction("CREATE_ENTITY")
export const UPDATE_ENTITY = defineAction("UPDATE_ENTITY")

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

// export const fetchDurableObjectAction = async <T, O>(
//     namespace: DurableObjectNamespace,
//     action: ActionDefinition<T, O>,
//     payload: T
// ) => {
//     if (!action.idGetter) {
//         throw new Error("Action must have idGetter to execute object namespace: " + action.name)
//     }
//     const id = action.idGetter(payload)
//     if (!id) {
//         throw new Error("Missing id in payload: " + JSON.stringify(payload))
//     }
//     const objectId = namespace.idFromName(id)
//     const instance = namespace.get(objectId)
//     return instance.fetch("http://localhost/", {
//         method: "POST",
//         body: JSON.stringify({ action: action.name, payload })
//     })
// }

// export const executeAction = async <T, O>(
//     namespace: DurableObjectStub | DurableObjectNamespace,
//     action: ActionDefinition<T, O>,
//     payload: T
// ): Promise<O> => {
//     let response: Response
//     if ("fetch" in namespace) {
//         // It's actually a service worker stub (DurableObjectStub is the closest type in cloudflare typings)
//         // So fetch from the worker; localhost can actually be any domain, it gets ignored, but it's needed
//         // for the request to parse correctly
//         response = await namespace.fetch("http://localhost/", {
//             method: "POST",
//             body: JSON.stringify({ action: action.name, payload })
//         })
//     } else {
//         response = await fetchDurableObjectAction(namespace, action, payload)
//     }
//     const result = (await response.json()) as ResultOrError<O>
//     if ("error" in result) {
//         throw new Error(result.error)
//     }
//     return result.result
// }

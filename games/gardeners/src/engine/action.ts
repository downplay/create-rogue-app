export interface IActionBody {
    action: string
    payload: any
}

export type ActionBody<T, N, O> = IActionBody & {
    action: N
    payload: T
}

export interface ActionDefinition<T, O> {
    name: string
    idGetter?: (payload: T) => string
}

export const defineAction = <T, O = T>(name: string, idGetter?: (payload: T) => string): ActionDefinition<T, O> => {
    return { name, idGetter }
}

export type ResultOrError<O> =
    | {
          error: string
      }
    | {
          result: O
      }

export const fetchDurableObjectAction = async <T, O>(
    namespace: DurableObjectNamespace,
    action: ActionDefinition<T, O>,
    payload: T
) => {
    if (!action.idGetter) {
        throw new Error("Action must have idGetter to execute object namespace: " + action.name)
    }
    const id = action.idGetter(payload)
    if (!id) {
        throw new Error("Missing id in payload: " + JSON.stringify(payload))
    }
    const objectId = namespace.idFromName(id)
    const instance = namespace.get(objectId)
    return instance.fetch("http://localhost/", {
        method: "POST",
        body: JSON.stringify({ action: action.name, payload })
    })
}

export const executeAction = async <T, O>(
    namespace: DurableObjectStub | DurableObjectNamespace,
    action: ActionDefinition<T, O>,
    payload: T
): Promise<O> => {
    let response: Response
    if ("fetch" in namespace) {
        // It's actually a service worker stub (DurableObjectStub is the closest type in cloudflare typings)
        // So fetch from the worker; localhost can actually be any domain, it gets ignored, but it's needed
        // for the request to parse correctly
        response = await namespace.fetch("http://localhost/", {
            method: "POST",
            body: JSON.stringify({ action: action.name, payload })
        })
    } else {
        response = await fetchDurableObjectAction(namespace, action, payload)
    }
    const result = (await response.json()) as ResultOrError<O>
    if ("error" in result) {
        throw new Error(result.error)
    }
    return result.result
}

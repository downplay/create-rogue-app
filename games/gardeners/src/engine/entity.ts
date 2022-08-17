import {
    ActionContext,
    ActionDefinition,
    EntityContext,
    EntityInstance,
    EntityType,
    GlobalInstanceDefinition
} from "./types"

// export type ReducerFunction<T> = (state: T, action: Action<T>) => T
// export const defineReducer = <T>(reducer: ReducerFunction<T>, defaultState) => {}

let currentContext: EntityContext | undefined

const gatherHooks = <I>(context: EntityContext, callback: () => I) => {
    if (currentContext) {
        console.log(currentContext, context)
        throw new Error("Cannot define another hooks context from within your build function")
    }
    currentContext = context
    const iface = callback()
    if (context.type === "") {
        throw new Error("Unnamed entity")
    }
    currentContext = undefined
    return iface
}

export const getEntityContext = () => {
    if (!currentContext) {
        throw new Error("Cannot use hooks outside of the durable object build function")
    }
    return currentContext
}

export const getEngine = () => {
    return getEntityContext().engine
}

export const definitions: EntityType<any, any>[] = []

export const defineEntity = <P extends {} = {}, I = void>(
    type: string,
    build: (props: P) => I
): EntityType<P, I> => {
    const defined = {
        type,
        newInstance: (context: EntityContext<P>, props: P) => {
            const iface = gatherHooks(context, () => build(props))
            // TODO: Something more complicated with proxy to bind the interface?
            return iface
        },
        updateInstance: (instance: EntityInstance<P, I>, props: P) => {
            // TODO: Clear hooks and re-run? Check for props differences?
            // Check for differences in dependent entities?
            // Gather dependencies during first run?
            return instance
        },
        rehydrateInstance: (instance: EntityInstance<P, I>, props: P) => {
            // TODO: Will need to fire a rehydrate action after running hooks?
            return instance
        }
    }
    definitions.push(defined)
    return defined
}

export const defineGlobalInstance = <T extends {} = {}, I = void>(
    entity: EntityType<T, I>,
    name?: string
): GlobalInstanceDefinition<T, I> => {
    return {
        name,
        entity
    }
}

export const getSelf = () => {
    const entity = getEntityContext()
    return entity.instance
}

// export const routeActionToObject = <T, O>(
//   namespaceOrGetter:
//     | DurableObjectNamespace
//     | ((payload: T) => DurableObjectNamespace),
//   action: ActionDefinition<T, O>
// ) => {
//   useAction(action, async (payload) => {
//     const namespace = isFunction(namespaceOrGetter)
//       ? namespaceOrGetter(payload)
//       : namespaceOrGetter;
//     return fetchDurableObjectAction(namespace, action, payload);
//   });
// };

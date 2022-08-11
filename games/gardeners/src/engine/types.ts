import { RNG } from "@hero/math"
import { MainAST } from "@hero/text"
import { EntityManager } from "./entityManager"

export const LABEL_TYPE = "Type"

export type ResultOrError<O> =
    | {
          error: string
      }
    | {
          result: O
      }

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
    cascade?: boolean
    // idGetter?: (payload: T) => string
}

export type DataRef<T = any> = {
    value: T
}

export type UpdateFunction<T> = (dataOrUpdater: T | ((value: T) => void)) => T

export type ActionContext<T extends {} = {}> = {
    target: EntityInstance<T>
    engine: WithEngine
}

export type EntityData = {
    data: DataRef
    // initialize: () => any
    // rehydrate?: (dry: any) => any
    update: UpdateFunction<any>
    // TODO: attachChangeListener/removeChangeListener
    // ...and fold into DataRef ?
}

export type EntityContext<P extends {} = {}> = {
    id: string
    type: string
    localData: Record<string, EntityData>
    actions: Record<string, ((payload: any, context: ActionContext) => any)[]>
    engine: WithEngine
    instance: EntityInstance<P, any>
    props: P
}

export type EntityInstance<P extends {} = {}, I = void> = {
    type: "WithEngine::EntityInstance"
    entity: EntityContext<P>
    interface: I
}

export type EntityDefinition<P extends {} = {}, I = void> = {
    type: string
    newInstance: (context: EntityContext<P>, props: P) => I
    updateInstance: (instance: EntityInstance<P, I>, props: P) => EntityInstance<P, I>
    rehydrateInstance: (instance: EntityInstance<P, I>, props: P) => EntityInstance<P, I>
}

export type WithEngine = {
    rng: RNG
    definitions: EntityType[]
    instances: EntityInstance[]
    entities: EntityManager
    globals: Record<string, EntityInstance>
    refresh: () => void
}

export type EntityType<T extends {} = {}, I = void> =
    | ((props: T) => I)
    | MainAST<T>
    | EntityDefinition<T, I>

export type GlobalInstanceDefinition<T extends {} = {}, I = void> = {
    name?: string
    entity: EntityType<T, I>
}

import { MainAST, render } from "@hero/text"
import { isFunction } from "remeda"
import { CREATE_ENTITY, dispatchAction } from "./action"
import {
    WithEngine,
    LABEL_TYPE,
    EntityType,
    EntityDefinition,
    EntityContext,
    EntityInstance
} from "./types"

export const entityTypeName = (engine: WithEngine, entity: EntityType<any, any>) => {
    if (isFunction(entity)) {
        throw new Error("No type name for function: " + entity.toString())
    } else if (entity.type === "main") {
        // TODO: It's quite inefficient for this case; should cache the result
        // Overall there is a better way to do this
        try {
            return render(entity as MainAST, engine.rng, {}, LABEL_TYPE)
        } catch (e) {
            console.error(entity)
            throw e
        }
    }
    return entity.type
}

let nextId = 1

export const entityManager = (engine: WithEngine) => {
    const entitiesMap = engine.definitions.reduce((acc, el) => {
        const type = entityTypeName(engine, el)
        if (!type) {
            console.error(el)
            throw new Error("Blank type")
        }
        if (acc[type]) {
            console.error(el)
            throw new Error("Two entities with type " + type)
        }
        acc[type] = el
        return acc
    }, {} as Record<string, EntityType>)

    const instances: Record<string, EntityInstance> = {}

    const get = (id: string) => {
        if (!instances[id]) {
            throw new Error("Entity instance not found: " + id)
        }
        return instances[id]
    }

    const create = <T extends {} = {}, I = {}>(
        template: EntityType<T, I> | string,
        props: T = {} as T
    ) => {
        // let instance: EntityInstance<I>
        // TODO: Really annoying. Random number generation just isn't happening in jsdom, apparently.
        // So we'll need to run an entire random numbers service just to generate sufficient randomness.
        // There is also the new react method to test out.
        // id: short.generate(),

        // TODO: Need to be able to set state within herotext syntax
        // Might look something like:
        // $create(Rat, size: <12>, hp: <10>)
        // Really need to think about this...

        // TODO: Also allow creation from named entity:
        const createType =
            typeof template === "string" ? engine.entities.templates[template] : template
        if (!createType) {
            throw new Error("Entity type not known: " + template)
        }
        const id = (nextId + 1).toString()

        if (isFunction(createType)) {
            throw new Error("Not implemented yet")
        }
        // TODO: A better form of "isMainAST" than this...
        else if (createType.type === "main") {
            // TODO:
            throw new Error("Not implemented yet")

            // instance = createInstance<EngineState & T>(createType, {
            //     engine,
            //     ...props
            // })
            // TODO: Stories must execute setup label, but should
            // this be via events instead, or should it be done by withStory hook?
            // executeInstance(instance, engine.rng, "setup")
        } else {
            // TODO: Make context and instance just the same thing to avoid
            // all this weird construction?
            const context = {
                id,
                type: createType.type,
                global: {},
                actions: {},
                localData: {},
                engine,
                props
            } as unknown as EntityContext<T>

            context.instance = {
                type: "WithEngine::EntityInstance",
                entity: context
            } as unknown as EntityInstance<T>

            context.instance.interface = (createType as EntityDefinition<T, I>).newInstance(
                context,
                props
            )

            instances[id] = context.instance
            dispatchAction(context.instance, CREATE_ENTITY, {})
            return context.instance
        }
    }

    const manager = {
        templates: entitiesMap,
        create,
        get
    }

    return manager
}

export type EntityManager = ReturnType<typeof entityManager>

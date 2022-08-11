import { useMemo } from "react"
import { entityTypeName } from "../engine/entityManager"
import { EntityType, GlobalInstanceDefinition, WithEngine } from "../engine/types"
import { createEngine, CreateEngineOptions } from "../engine/withEngine"

type Instance = {
    entity: EntityType<any, any>
    props: any
}

type GlobalInstance = {
    global: GlobalInstanceDefinition<any, any>
    props: any
}

export const useEngine = <T extends {}>(
    props: CreateEngineOptions,
    root: Instance,
    globals: GlobalInstance[]
): WithEngine => {
    return useMemo(() => {
        const engine = createEngine(props)
        for (const { global, props } of globals) {
            const name = global.name || entityTypeName(engine, global.entity)
            const instance = engine.entities.create(global.entity, props)
            engine.globals[name] = instance
        }
        engine.entities.create(root.entity, root.props)
        return engine
    }, [props, root, globals])
}

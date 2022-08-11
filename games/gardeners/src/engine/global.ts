import { useEngineContext } from "../providers/EngineProvider"
import { getEngine } from "./entity"
import { entityTypeName } from "./entityManager"
import { EntityInstance, GlobalInstanceDefinition, WithEngine } from "./types"

const findGlobalInstance = <T extends {} = {}, I = void>(
    engine: WithEngine,
    global: GlobalInstanceDefinition<T, I>
) => {
    const searchName = global.name || entityTypeName(engine, global.entity)
    if (!(searchName in engine.globals)) {
        throw new Error("Can't find global instance: " + searchName)
    }
    return engine.globals[searchName] as unknown as EntityInstance<T, I>
}

export const useGlobalInstance = <T extends {}, I>(global: GlobalInstanceDefinition<T, I>) => {
    const engine = useEngineContext()
    return findGlobalInstance<T, I>(engine, global)
}

export const getGlobalInstance = <T extends {}, I>(global: GlobalInstanceDefinition<T, I>) => {
    const engine = getEngine()
    return findGlobalInstance<T, I>(engine, global)
}

import { RNG } from "@hero/math"
import { entityManager } from "./entityManager"
import { EntityType, WithEngine } from "./types"

export type CreateEngineOptions = {
    definitions: EntityType<any, any>[]
    rng: RNG
    onRefresh: () => void
}

export const createEngine = ({ definitions, rng, onRefresh }: CreateEngineOptions): WithEngine => {
    // const map = grid()

    const engine: Partial<WithEngine> = {
        // map,
        // game,
        definitions,
        rng,
        instances: [],
        globals: {},
        // TODO: Feels messy, pushing react updates should be handled
        // more elegantly
        refresh: onRefresh
    }

    engine.entities = entityManager(engine as WithEngine)
    // engine.player = engine.entities.create(Player)
    // engine.content = []
    // const turns = turnManager();

    return engine as WithEngine
}

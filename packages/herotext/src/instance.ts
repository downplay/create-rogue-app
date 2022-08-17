import { RNG } from "@hero/math"
import { MainAST, ExecutionResult } from "./types"
import { beginExecution } from "./execute"

export type StoryInstance<T extends {} = {}> = {
    type: "Herotext::StoryInstance"
    story: MainAST
    globalScope: T
}

export const createInstance = <T extends {} = {}>(
    story: MainAST,
    globalScope?: T
): StoryInstance<T> => ({
    type: "Herotext::StoryInstance",
    story,
    globalScope: globalScope || ({} as T)
})

export const executeInstance = <T extends {} = {}>(
    instance: StoryInstance<T>,
    rng: RNG,
    entryPoint = ""
): ExecutionResult => {
    const [result, context] = beginExecution(instance.story, rng, instance.globalScope, entryPoint)
    // TODO: Actually do we need to update instance at all? Since state is never
    // copied. Or will we copy state to a more usable form during execution and then
    // marshall back to a POJO once done?
    // instance.globalScope = context.state;
    return [result, context]
}

export const instanceHas = <T extends {} = {}>(
    instance: StoryInstance<T>,
    path: string
): boolean => {
    return path in instance.story.labels || path in instance.globalScope
}

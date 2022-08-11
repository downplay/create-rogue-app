import {
    createInstance,
    executeInstance,
    executeText,
    ExecutionContext,
    MainAST,
    resumeExecution,
    StoryInstance
} from "@hero/text"
import { Terminal, TerminalGlobal } from "../game/Terminal"
import { onCreate, onUpdate } from "./action"
import { defineData, hasData } from "./data"
import { getEngine } from "./entity"
import { getGlobalInstance } from "./global"
import { WithEngine } from "./types"

const StoryData = defineData<ExecutionContext>("Story")

type StoryState = {
    engine: WithEngine
}

export const hasStory = <T = undefined>(template: MainAST<T>, initialState: T = {} as T) => {
    // TODO: How do we import data cleanly
    // TODO: Kinda bad that we serialize the entire story here, well, it does
    // ensure it'll work in a future version as long as the AST doesn't change,
    // but it also makes updates a bit flaky as we can't patch bugs in stories.
    // Should use a special serializer
    const [state, updateState] = hasData(StoryData)
    const engine = getEngine()
    const terminal = getGlobalInstance(TerminalGlobal)
    onCreate(() => {
        const instance = createInstance<StoryState & T>(template, {
            engine,
            ...initialState
        })
        // TODO: don't use the global RNG; create a new one with a seed generated from
        // an RNG from a parent instance etc
        /*const [result, context] =*/ executeInstance(instance, engine.rng, "onSetup")
        const [result, context] = executeInstance(instance, engine.rng)
        terminal.interface.write(result)
        updateState(context)
        // return instance
    })

    onUpdate(() => {
        // if (state.value.suspend) {
        //     const result = resumeExecution(state.value)
        //     terminal.interface.write(result)
        // }
    })
}

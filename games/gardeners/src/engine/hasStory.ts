import {
    createInstance,
    executeInstance,
    ExecutionContext,
    instanceHas,
    MainAST,
    resumeExecution,
    stringifyResult
} from "@hero/text"
import { ExecutionResult, ExecutionResultItem, NodeExecutionResult } from "@hero/text/src/types"
import { isArray, isObject } from "remeda"
import { TerminalGlobal } from "../game/Terminal"
import { TerminalContent } from "../ui/TerminalUI"
import { onCreate, onUpdate } from "./action"
import { defineData, hasData } from "./data"
import { getEngine, getEntityContext, getSelf } from "./entity"
import { getGlobalInstance } from "./global"
import { WithEngine } from "./types"

const StoryData = defineData<ExecutionContext>("Story")

type StoryState = {
    engine: WithEngine
}

const nonStringifiableTypes = ["trigger", "ui"]

export const hasStory = <T = undefined>(template: MainAST<T>, initialState: T = {} as T) => {
    console.log(template)
    // TODO: How do we import data cleanly
    // TODO: Kinda bad that we serialize the entire story here, well, it does
    // ensure it'll work in a future version as long as the AST doesn't change,
    // but it also makes updates a bit flaky as we can't patch bugs in stories.
    // Should use a special serializer
    const [state, updateState] = hasData(StoryData)
    const engine = getEngine()
    const terminal = getGlobalInstance(TerminalGlobal)
    const me = getSelf()

    const transformExecutionResult = (result: NodeExecutionResult) => {
        // TODO: Now there's a serialization problem suddenly. If the terminal is handling
        // an input for the story we need to know which story to link the result back to.
        // It's a problem if the game is saved mid-story and we need to reconstruct the state.
        const terminalOutput: TerminalContent = []
        for (const item of result) {
            if (isArray(item)) {
                const subResults = transformExecutionResult(
                    item as unknown as ExecutionResultItem[]
                )
                terminalOutput.push(...subResults)
            } else if (
                isObject(item) &&
                "type" in item &&
                nonStringifiableTypes.includes(item.type)
            ) {
                switch (item.type) {
                    case "trigger":
                        // Just pauses execution
                        break
                    case "ui": {
                        switch (item.handler) {
                            case "buttonStart":
                                // TODO: Pass the strand so the terminal can update it without
                                // a complicated chain of callbacks
                                terminalOutput.push({
                                    type: "buttonStart"
                                })
                                break
                            case "buttonEnd":
                                terminalOutput.push({
                                    type: "buttonEnd",
                                    instanceId: me.entity.id,
                                    name: item.name
                                })
                                break

                            default:
                                throw new Error("Unhandled UI handler: " + item.type)
                        }
                        break
                    }
                    default:
                        throw new Error("Unhandled output type: " + item.type)
                }
            } else {
                // TODO: Make newlines
                terminalOutput.push(stringifyResult(item))
            }
        }
        return terminalOutput
    }

    onCreate(() => {
        const instance = createInstance<StoryState & T>(template, {
            engine,
            ...initialState
        })
        // TODO: don't use the global RNG; create a new one with a seed generated from
        // an RNG from a parent instance etc
        /*const [result, context] =*/
        if (instanceHas(instance, "onSetup")) {
            executeInstance(instance, engine.rng, "onSetup")
        }
        const [result, context] = executeInstance(instance, engine.rng)

        terminal.interface.write(transformExecutionResult(result))
        updateState(context)
        // return instance
    })

    onUpdate(() => {
        if (state.value.suspend) {
            const result = resumeExecution(state.value)
            terminal.interface.write(transformExecutionResult(result))
        }
    })
}

import { ExternalNodeCallback } from "@hero/text"
import { isFunction } from "remeda"

type EndToken = {}
const end: EndToken = {}

const executor = <I, S = {}>(
    callback: (frame: I, end: EndToken) => I | EndToken | undefined,
    initialFrame?: S | ((state: S) => I)
): ExternalNodeCallback<S> => {
    return (state, context, strand) => {
        if (!strand.internalState && initialFrame) {
            strand.internalState = isFunction(initialFrame) ? initialFrame(state) : initialFrame
        }
        const internalState = strand.internalState as I
        const result = callback(internalState, end)
        if (result === end) {
            return ""
        }
        strand.internalState = result
        context.suspend = true
        return [{ type: "trigger" }]
    }
}

type WaitState = {
    ticks: number
    start: number
}

const executeWait = (ms: number) => (state: WaitState, end: EndToken) => {
    if (state.ticks === 0) {
        state.start = Date.now()
        state.ticks = 1
    } else {
        state.ticks = Date.now() - state.start
    }
    if (state.ticks < ms) {
        return state
    }
    return end
}

export const wait = (ms: number) => executor<WaitState>(executeWait(ms), { ticks: 0, start: 0 })

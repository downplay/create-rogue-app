import { ExternalNodeCallback } from "@hero/text"
import { isFunction } from "remeda"

type EndToken = {}
const end: EndToken = {}
export type ExecutorCallback<I> = (frame: I, end: EndToken) => I | EndToken | undefined

export const executor = <I, S = {}>(
    callback: ExecutorCallback<I>,
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
        strand.suspend = true
        // TODO: Not sure of the usefulness of handler, maybe it should
        // be optional.
        return [{ type: "trigger", strand, handler: "executor" }]
    }
}

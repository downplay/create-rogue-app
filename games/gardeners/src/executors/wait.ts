import { executor, ExecutorCallback } from "./executor"

type WaitState = {
    ticks: number
    start: number
}

const executeWait =
    (ms: number): ExecutorCallback<WaitState> =>
    (state, end) => {
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

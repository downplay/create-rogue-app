import { onCreate, onUpdate } from "../../engine/action"
import { defineData, hasData } from "../../engine/data"

type ClockState = {
    start: number
    current: number
    time: number
}

export const ClockData = defineData<ClockState>("Clock")

export const hasClock = () => {
    const [state, updateState] = hasData(ClockData, () => ({ start: 0, current: 0, time: 0 }))

    onCreate(() => {
        const current = new Date().getTime()
        updateState({
            start: current,
            current,
            time: 0
        })
    })

    onUpdate(() => {
        const current = new Date().getTime()
        updateState({
            ...state.value,
            current,
            time: (current - state.value.start) / 1000
        })
    })

    return state
}

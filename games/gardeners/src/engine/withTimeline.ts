import { isVector, Vector } from "@hero/math"
import { hasClock } from "../game/mechanics/hasClock"
import { onSceneRender } from "../with-three/GameCanvas"
import { hasRootNode } from "../with-three/hasRootNode"
import { EntityInstance } from "./types"

type TimelineProp<V extends number | Vector> = {
    get: (instance: EntityInstance<any>) => V
    set: (instance: EntityInstance<any>) => void
}

type TimelineFrameValue<V extends number | Vector = Vector> = {
    prop: TimelineProp<V>
    value: V
}

export type TimelineFrame = {
    time: number
    values: TimelineFrameValue[]
}

export type Timeline = TimelineFrame[]

export type TimelineInitializer = (TimelineFrame | Vector)[]

type TimelineOptions = {
    autoplay?: boolean
    repeat?: "infinite" | number
    loop?: "loop" | "pingpong"
}

const prepareTimeline = (initial: TimelineInitializer) => {
    const timeline: Timeline = []

    for (const item of initial) {
        if (isVector(item)) {
            // timeline.push({
            // })
        } else {
            timeline.push(item)
        }
    }

    return timeline
}

export const withTimeline = (initial: TimelineInitializer, options?: TimelineOptions) => {
    const node = hasRootNode()
    const clock = hasClock()

    let last = clock.value.current
    let playing = false
    let current = 0
    let repeated = 0
    const length = 1

    const prepared = prepareTimeline(initial)

    onSceneRender(() => {
        if (playing) {
            const delta = clock.value.current - last
            current += delta
            if (current > length) {
                if (!options?.repeat) {
                    current = length
                } else {
                    if (options.repeat === "infinite" || options.repeat > repeated) {
                        current = 0
                        repeated += 1
                    }
                    // TODO: Implement pingpong
                }
                current -= length
            }

            // Now, interpolate current value
        }
        last = clock.value.current
    })

    const play = (from: number | "resume" = 0) => {
        playing = true
        if (from !== "resume") {
            repeated = 0
            current = from
        }
    }

    const pause = () => {
        playing = false
    }

    if (options?.autoplay) {
        play()
    }
    return [play, pause]
}

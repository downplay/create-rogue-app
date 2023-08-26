import { atom, useAtom } from "jotai"
import { useRef } from "react"
import {
    recruitsAtom,
    recruitsSeedAtom,
    recruitsSeedTimeAtom,
    regenerateRecruits
} from "./recruits"
import { generateSeed } from "./rng"
import { HeroModule } from "./hero"
import { actorsAtom, defineAction, gameTimeTicksAtom } from "./actor"
import { useFrame, useThree } from "@react-three/fiber"

export const GameLoopAction = defineAction<{ time: number; delta: number }>("GameLoop")

type SetGameTimeAction = {
    type: "increment"
    delta: number
}

// TODO: Restock time should change with upgrades. Start off very slow. And also change
// when new recruitment resources are discovered, and also have the option to do so on
// demand with some resource payment. Also to trigger a "pro recruit" event.
const RECRUITS_RESTOCK_INTERVAL = 60 * 60 // 1 hour

const gameTimeAtom = atom(
    (get) => get(gameTimeTicksAtom),
    (get, set, update: SetGameTimeAction) => {
        const currentTime = get(gameTimeTicksAtom)
        const nextTime = currentTime + update.delta

        // Restock recruits?
        if (get(recruitsSeedTimeAtom) <= nextTime) {
            const old = get(recruitsAtom)
            // Destroy old heroes if unbought
            for (const r of old) {
                if (!get(HeroModule.family(r.id)).owner) {
                    set(r.hero, { type: "destroy" })
                }
            }
            console.log("Regenerating seed as " + get(recruitsSeedTimeAtom) + " < " + nextTime)
            set(recruitsSeedAtom, generateSeed())
            set(recruitsSeedTimeAtom, nextTime + RECRUITS_RESTOCK_INTERVAL)
            regenerateRecruits(get, set)
        }

        set(gameTimeTicksAtom, nextTime)

        const actors = get(actorsAtom)

        const payload = {
            type: "tick",
            time: nextTime,
            delta: update.delta
        }

        for (const a of actors) {
            set(a, { type: "action", action: GameLoopAction, payload })
        }
    }
)

export const GameLoop = () => {
    // TODO: Actually not happy with this having to run inside Three's canvas, it means the
    // game loop can't run if we're off at another screen e.g. town. Should go back to
    // requestanimationframe? And only have the events.update() bit inside Canvas

    // TODO: We'll also need to store something in storage so we can simulate time passed
    // when AFK. Also be careful of multiple windows being open! (we could actually even support
    // this e.g. if you want to monitor different heroes on different screens, once storage
    // is moved to server and everything is websockets)
    const lastTick = useRef(new Date())
    const [gameTime, setGameTime] = useAtom(gameTimeAtom)

    const events = useThree((state) => state.events)
    useFrame(() => {
        // Will trigger a onPointerMove with the last-known pointer event
        if (events.update) {
            events.update()
        }
        // Update game time
        const currentTick = new Date()
        const passedTime = currentTick.getTime() - lastTick.current.getTime()
        lastTick.current = currentTick

        // Here we are actually proccing the time passed
        setGameTime({ type: "increment", delta: passedTime / 1000 })
    })

    return null
}

import { atom, useAtom } from "jotai"
import { useCallback, useEffect, useRef } from "react"
import { recruitsSeedAtom, recruitsSeedTimeAtom } from "./recruits"
import { generateSeed } from "./rng"

export const gameTimeTicksAtom = atom(0)

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
            console.log("Regenerating seed as " + get(recruitsSeedTimeAtom) + " < " + nextTime)
            // Setting the seed will cause recruits list to regenerate via Jotai magic
            set(recruitsSeedAtom, generateSeed())
            set(recruitsSeedTimeAtom, nextTime + RECRUITS_RESTOCK_INTERVAL)
        }

        set(gameTimeTicksAtom, nextTime)
    }
)

export const useGameLoop = () => {
    // TODO: We'll also need to store something in storage so we can simulate time passed
    // when AFK. Also be careful of multiple windows being open! (we could actually even support
    // this e.g. if you want to monitor different heroes on different screens, once storage
    // is moved to server and everything is websockets)
    const lastTick = useRef(new Date())
    const [gameTime, setGameTime] = useAtom(gameTimeAtom)
    // TODO: Really we want different components to modularly register some kind of onTick
    // handler. Maybe similar to how the observable atom works. Then we can proc anything we
    // need e.g. timed gains, resets etc. Right now the control needs inverting as we're having
    // update things from here we shouldn't have to.
    const handleTick = useCallback(() => {
        const currentTick = new Date()
        const passedTime = currentTick.getTime() - lastTick.current.getTime()
        lastTick.current = currentTick

        // Here we are actually proccing the time passed

        setGameTime({ type: "increment", delta: passedTime / 1000 })
        requestAnimationFrame(handleTick)
    }, [])
    useEffect(() => {
        // TODO: We should handle unmounting of this loop. We would need an additional ref which
        // we set as true to unmount.
        requestAnimationFrame(handleTick)
    }, [handleTick])
}

import { atom, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { useGamepads, GamepadRef } from "react-ts-gamepads"
import { useRaf, useRafLoop } from "react-use"
import { activeHeroAtom } from "../model/hero"
import { LocationData, SpeedModule } from "../model/actor"
import { zoomFactorAtom } from "../3d/FollowCamera"

const DEADZONE = 0.00002

const isActive = (axisValue: number) => Math.abs(axisValue) > DEADZONE

// TODO: Really should be handled by movementmodule and we'll just send a target there?
const gamePadMovementAtom = atom(undefined, (get, set, x: number, y: number, delta: number) => {
    const activeHero = get(activeHeroAtom)
    const xFinal = isActive(x) ? x : 0
    const yFinal = isActive(y) ? y : 0
    if (activeHero) {
        const locationFamily = LocationData.family(activeHero.id)
        const location = get(locationFamily)
        const speed = get(SpeedModule.family(activeHero.id))
        const position = {
            x: location.position.x + xFinal * speed * delta,
            y: location.position.y + yFinal * speed * delta
        }
        const direction = Math.atan2(x, -y) / Math.PI / 2
        set(locationFamily, (l) => ({ ...l, direction, position }))
    }
    // TODO: Otherwise, control UI
})

export const GamePad = () => {
    const timeRef = useRef(new Date().getTime())
    const [gamepads, setGamepads] = useState<GamepadRef>({})
    useGamepads((gamepads) => setGamepads(gamepads))
    const setGamePadMovement = useSetAtom(gamePadMovementAtom)
    const setZoomFactor = useSetAtom(zoomFactorAtom)
    useRafLoop(() => {
        if (!gamepads[0]) {
            console.log(gamepads)
            return
        }
        const newTime = new Date().getTime()
        const delta = (newTime - timeRef.current) / 1000
        timeRef.current = newTime

        const x = gamepads[0].axes[0]
        const y = gamepads[0].axes[1]
        if (isActive(x) || isActive(y)) {
            setGamePadMovement(x, y, delta)
        }

        const zoom = gamepads[0].axes[3]
        if (isActive(zoom)) {
            setZoomFactor((current) => Math.min(10, Math.max(0.01, current + zoom * delta * 4)))
        }
        // console.log(
        //     gamepads[0].axes[0],
        //     gamepads[0].axes[1],
        //     gamepads[0].axes[2],
        //     gamepads[0].axes[3]
        // )
    }, true)
    return null
}

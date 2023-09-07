import { atom, useAtomValue } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { useFrame, useThree } from "@react-three/fiber"
import { useModuleRef, LocationData, useAtomRef } from "../model/actor"
import { roomFamily } from "../model/room"
import { Vector3 } from "three"

export const zoomFactorAtom = atom(2)

export const FollowCamera = () => {
    const heroId = useAtomValue(activeHeroIdAtom)
    const locationRef = useModuleRef(LocationData, heroId)
    const room = useAtomRef(roomFamily(locationRef.current?.room))
    const zoomFactor = useAtomRef(zoomFactorAtom)
    const { camera } = useThree()
    useFrame(() => {
        if (!locationRef.current) {
            return
        }
        // TODO: Only recompute center etc if room/player changes or player moves
        // TODO: Give the camera accelerated movement towards the focus point
        const focus = new Vector3(locationRef.current.position.x, 0, locationRef.current.position.y)
        let target = focus
        let center = new Vector3(focus.x, focus.y, focus.z)
        if (room.current) {
            // Average two positions
            center = new Vector3(
                room.current.area.x + room.current.area.width / 2,
                0,
                room.current.area.y + room.current.area.height / 2
            )
            target.add(center).multiplyScalar(0.5)
        }
        // TODO: Move further back depending on the size of the object we need to keep in view
        // const pos = new Vector3(center.x, center.y + 30, center.z + 50)
        camera.position.x = center.x
        camera.position.y = center.y + zoomFactor.current * 3
        camera.position.z = center.z + zoomFactor.current * 5
        camera.lookAt(target)
    })

    return null
}

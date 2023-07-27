import { useAtomValue } from "jotai"

import { ActorLocation, actorLocationFamily } from "../model/hero"
import { HumanRender } from "./characters/HumanRender"
import { useMemo } from "react"
import { UNITS_PER_CELL } from "../model/dungeon"
import { Euler } from "three"

const useLocationToPosition = (location: ActorLocation) => {
    return useMemo(
        () =>
            [
                location.position.x * UNITS_PER_CELL,
                0,
                location.position.y * UNITS_PER_CELL
            ] as const,
        [location]
    )
}

const useLocationToRotation = (location: ActorLocation) => {
    return useMemo(() => new Euler(0, -location.direction * Math.PI * 2, 0), [location])
}

export const Hero = ({ id }: { id: string }) => {
    // const hero = useAtomValue(heroFamily(id))
    const location = useAtomValue(actorLocationFamily("Hero:" + id))

    // TODO: Would this be more performant if we return matrices but keep them buffered
    // with a useRef and update them with a useEffect rather than useMemo?
    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)
    return (
        <group position={position} rotation={rotation}>
            <HumanRender id={id} />
        </group>
    )
}

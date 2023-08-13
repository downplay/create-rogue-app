// TODO: Would this be more performant if we return matrices but keep them buffered

import { useMemo } from "react"
import { ActorLocation } from "../model/hero"
import { UNITS_PER_CELL } from "../model/dungeon"
import { Euler } from "three"

// with a useRef and update them with a useEffect rather than useMemo?
export const useLocationToPosition = (location: ActorLocation) => {
    return useMemo(() => [location.position.x, 0, location.position.y] as const, [location])
}

export const useLocationToRotation = (location: ActorLocation) => {
    return useMemo(() => new Euler(0, -location.direction * Math.PI * 2, 0), [location])
}

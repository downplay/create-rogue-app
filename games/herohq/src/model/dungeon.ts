import { atomWithStorage } from "jotai/utils"

export type Quad = {
    x: number
    y: number
    width: number
    height: number
}

export const UNITS_PER_CELL = 10

const monstersAtom = atomWithStorage("monsters", [])

export const dungeonAtom = () => {}

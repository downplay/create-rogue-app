import { atomWithStorage } from "jotai/utils"

// TODO: Maybe specify the name more e.g. GamePosition
export type Position = {
    x: number
    y: number
}

export type Quad = Position & {
    width: number
    height: number
}

export const UNITS_PER_CELL = 10

const monstersAtom = atomWithStorage("monsters", [])

export const dungeonAtom = () => {}

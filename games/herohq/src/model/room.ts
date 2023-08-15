import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { Position, Quad } from "./spacial"

export type DoorData = {
    id: string
    normal: Position
    position: Position
    roomId: string
    doorId: string
    // TODO: Do we need to know which wall it's on or is normal enough?
}

export type RoomData = {
    id: string
    area: Quad
    doors: DoorData[]
}

// TODO: Consider doing like Roster and just storing seeds for floors so we
// can generate on demand. Maybe overkill tho.
export const roomsAtom = atomWithStorage<RoomData[]>("Rooms", [])

export const roomFamily = (id?: string) => atom((get) => get(roomsAtom).find((r) => r.id === id))

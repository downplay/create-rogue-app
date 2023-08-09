import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { makeRng } from "./rng"
import { generateRooms, populateRoom } from "./generators"

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

type DungeonUpdateCommand = {
    type: "initialize"
    level: number
}

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

// TODO: Handle this seed.
export const dungeonSeedAtom = atom("kittyunicornbananashroom")

export const dungeonAtom = atom(
    (get) => {},
    (get, set, update: DungeonUpdateCommand) => {
        switch (update.type) {
            case "initialize":
                // TODO: Make sure we recycle any dungeons/actors we don't need
                const seed = get(dungeonSeedAtom)
                const rng = makeRng(seed)
                const rooms = generateRooms(rng, update.level)
                for (const room of rooms) {
                    populateRoom({ rng, level: update.level, room, seed, get, set })
                }
                break
        }
    }
)

import { atom } from "jotai"
import { makeRng } from "./rng"
import { generateRooms, populateRoom } from "./generators"
import { roomsAtom } from "./room"
import { actorFamily } from "./actor"
import { visibleActorIdsFamily } from "../gui/Dungeon"

export const UNITS_PER_CELL = 10

type DungeonGenerator = {
    location: string
}

type DungeonUpdateCommand = {
    type: "initialize"
    location: string
    generator: DungeonGenerator
}

// TODO: Handle this seed.
export const dungeonSeedAtom = atom("kittyunicornbananashroom")

export const dungeonAtom = atom(
    (get) => {
        return {
            rooms: get(roomsAtom)
        }
    },
    (get, set, update: DungeonUpdateCommand) => {
        switch (update.type) {
            case "initialize": {
                const actors = get(visibleActorIdsFamily(update.location))
                for (const a of actors) {
                    if (get(actorFamily(a)).type !== "Hero") {
                        set(actorFamily(a), { type: "destroy" })
                    }
                }
                // TODO: Make sure we recycle any dungeons/actors we don't need
                const seed = get(dungeonSeedAtom)
                const rng = makeRng(seed)
                const rooms = generateRooms(rng, update.level)
                for (const room of rooms) {
                    populateRoom({ rng, level: update.level, room, seed, get, set })
                }
                set(roomsAtom, rooms)
                break
            }
        }
    }
)

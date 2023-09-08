import { Random } from "random"
import { BugMonster } from "../dungeon/monsters/bug"
import { Getter, Setter } from "jotai"
import { ActorDefinition, DataSpec, LocationData, actorFamily } from "./actor"
import { BubbleMonster } from "../dungeon/monsters/bubble"
import { RoomData } from "./room"
import { LevelData } from "./level"

// TODO: Being a bit lazy to get things working. But at least it's working.
// Need to crowbar in the heromap code asap because it'll inform the shape
// of these generators much better. We'll sort of lose the "Room" concept
// because a room will just be a bunch of wall and floor tiles.

export type EntityData = {
    id?: string
    type: ActorDefinition
    data: DataSpec<any>[]
}

type RoomGeneratorProps = {
    rng: Random
    level: number
    seed: string
    room: RoomData
    get: Getter
    set: Setter
}

type RoomGenerator = (props: RoomGeneratorProps) => EntityData[]

type DungeonGenerator = (props: { rng: Random; level: number }) => RoomData[]

const CELL_SIZE = 32

const classicGridLayoutGenerator: DungeonGenerator = ({ level, rng }) => {
    const rooms: RoomData[] = []
    const irwin = rng.irwinHall(4)
    // Nothing complicated yet. Just a 4x4 grid of rooms, no missing gaps yet.
    const roomsX = 1
    const roomsY = 1
    for (let n = 0; n < roomsY; n++) {
        for (let m = 0; m < roomsX; m++) {
            const mapSize = {
                width: Math.floor(5 + irwin() * 5),
                height: Math.floor(5 + irwin() * 5)
            }
            rooms.push({
                id: "Room:" + level + ":" + n + ":" + m,
                area: {
                    x: m * CELL_SIZE + rng.int(1, CELL_SIZE - mapSize.width - 1),
                    y: n * CELL_SIZE + rng.int(1, CELL_SIZE - mapSize.height - 1),
                    ...mapSize
                },
                doors: []
            })
        }
    }
    return rooms
}

export const generateRooms = (rng: Random, level: number) => {
    return classicGridLayoutGenerator({ rng, level })
}

const randomPlacement: RoomGenerator = ({ room, rng, level }) => {
    const mobMax = Math.ceil(room.area.width * room.area.height) / 20
    const dist = rng.logNormal(0.5, 0.5)
    const mobCount = Math.min(mobMax, dist())
    const entities: EntityData[] = []
    // TODO: Some different placement strategies, e.g. grouped around a big monster or center point,
    // small groups, chilling in a pool...
    for (let n = 0; n < mobCount; n++) {
        // TODO: Also account for physical monster size
        const position = {
            x: room.area.x + rng.float(room.area.width),
            y: room.area.y + rng.float(room.area.height)
        }
        entities.push({
            type: BugMonster,
            // type: BubbleMonster,
            // TODO: Figure out using storytext to do roomgen / encounters/ monsters / etc
            data: [
                [
                    LocationData,
                    { location: "Dungeon:" + level, position, direction: rng.next(), room: room.id }
                ],
                [LevelData, Math.max(1, Math.round(level + dist() * 5 - 2))]
            ]
        })
    }
    return entities
}

export const populateRoom = (props: RoomGeneratorProps) => {
    // TODO: Mob choice separate from placement strat
    const actors = randomPlacement(props)
    const { set } = props
    for (const a of actors) {
        const id =
            "D:" + props.level + ":" + props.room.id + ":" + crypto.randomUUID() + ":" + a.type.name
        set(actorFamily(id), {
            type: "initialize",
            actor: a.type,
            data: a.data
        })
    }
}

import { RenderModule, defineActor, defineData } from "../../model/actor"
import { FloorRender } from "./Floor"
import { TileModule } from "./tile"

export const TextureIndexData = defineData("TextureIndex", 0)

export const FloorTile = defineActor("Floor", [
    [RenderModule, { renderer: FloorRender }],
    [TileModule, { blocking: false }]
])

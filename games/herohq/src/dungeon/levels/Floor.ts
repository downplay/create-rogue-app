import { RenderModule, defineActor } from "../../model/actor"
import { FloorRender } from "./FloorRender"
import { TileModule } from "./tile"

export const FloorTile = defineActor("Floor", [
    [RenderModule, { renderer: FloorRender }],
    [TileModule, { blocking: false }]
])

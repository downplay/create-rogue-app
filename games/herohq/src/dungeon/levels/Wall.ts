import { RenderModule, defineActor } from "../../model/actor"
import { WallRender } from "./WallRender"
import { TileModule } from "./tile"

export const WallTile = defineActor("Wall", [
    [RenderModule, { renderer: WallRender }],
    [TileModule, { blocking: true }]
])

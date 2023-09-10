import { defineActor } from "../../model/actor"
import { TileModule } from "./tile"

export const WallTile = defineActor("Wall", [[TileModule, { blocking: true }]])

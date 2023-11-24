import { defineModule } from "../../model/actor"
import { defineData } from "../../model/actor"

export const TileModule = defineModule<{ blocking: boolean }, { blocking: boolean }>(
    "Tile",
    ({ blocking }) => ({ blocking }),
    () => undefined
)

export const TextureIndexData = defineData("TextureIndex", 0)

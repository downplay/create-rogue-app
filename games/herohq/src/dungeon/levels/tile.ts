import { defineModule } from "../../model/actor"

export const TileModule = defineModule<{ blocking: boolean }, { blocking: boolean }>(
    "Tile",
    ({ blocking }) => ({ blocking }),
    () => undefined
)

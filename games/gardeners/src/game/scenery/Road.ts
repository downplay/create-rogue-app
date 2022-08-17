import { defineEntity } from "../../engine/entity"
import { isFloorTile } from "../mechanics/isFloorTile"
import roadTexture from "./textures/cobble.png"

export const Road = defineEntity("Road", () => {
    isFloorTile(roadTexture)
})

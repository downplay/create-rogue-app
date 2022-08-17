import { defineEntity } from "../../engine/entity"
import { isFloorTile } from "../mechanics/isFloorTile"
import grassTexture from "./textures/grass.png"
import grassTexture1 from "./textures/grass1.png"

export const Grass = defineEntity("Grass", () => {
    isFloorTile(grassTexture, grassTexture1)
})

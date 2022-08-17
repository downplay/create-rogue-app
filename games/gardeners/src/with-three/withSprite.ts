import { Sprite, SpriteMaterial, TextureLoader } from "three"
import { getGlobalInstance } from "../engine/global"
import { hasRootNode } from "./hasRootNode"
import { GlobalMaterialManager, MaterialManager } from "./MaterialManager"

export const withSprite = (...paths: string[]) => {
    const materials = getGlobalInstance(GlobalMaterialManager)
    const material = materials.interface.getSprite({
        name: paths[0],
        sprites: paths
    })
    const node = hasRootNode()
    const sprite = new Sprite(material)
    sprite.position.y = 0.5
    node.add(sprite)
}

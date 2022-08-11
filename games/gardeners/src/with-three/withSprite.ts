import { Sprite, SpriteMaterial, TextureLoader } from "three"
import { hasRootNode } from "./hasRootNode"

export const withSprite = (path: string) => {
    // TODO: How to globally cache textures?
    // Do we need a global texture manager / cache?
    const node = hasRootNode()
    const textureLoader = new TextureLoader()
    const map = textureLoader.load(path)
    const material = new SpriteMaterial({ map, color: 0xffffff })
    const sprite = new Sprite(material)
    node.add(sprite)
}

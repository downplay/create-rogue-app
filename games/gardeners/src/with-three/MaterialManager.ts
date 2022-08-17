import {
    DoubleSide,
    MeshBasicMaterial,
    MeshStandardMaterial,
    SpriteMaterial,
    Texture,
    TextureLoader
} from "three"
import { defineEntity, defineGlobalInstance } from "../engine/entity"
import { withRng } from "../hooks/useRng"

// TODO: Support stuff like bump maps and more advanced shaders
// maybe need something much more composable
type MaterialDefinition = {
    name: string
    sprites: string[]
}

// TODO: Maybe could be implemented via a more general caching system
export const MaterialManager = defineEntity("MaterialManager", () => {
    const materialCache: Record<string, { maps: Texture[] }> = {}
    const textureLoader = new TextureLoader()
    const rng = withRng()

    const loadTextures = (def: MaterialDefinition) => {
        if (!(def.name in materialCache)) {
            const maps = def.sprites.map((s) => textureLoader.load(s))
            materialCache[def.name] = {
                maps
            }
        }
        return materialCache[def.name]
    }

    const getSprite = (def: MaterialDefinition) => {
        const cached = loadTextures(def)
        const material = new SpriteMaterial({
            map: rng.pick(cached.maps),
            color: 0xffffff
        })
        return material
    }

    const getMeshBasic = (def: MaterialDefinition) => {
        const cached = loadTextures(def)
        const material = new MeshStandardMaterial({
            map: rng.pick(cached.maps),
            color: 0xffffff,
            // color: 0x000000,
            side: DoubleSide
        })
        return material
    }

    return {
        getSprite,
        getMeshBasic
    }
})

export const GlobalMaterialManager = defineGlobalInstance(MaterialManager)

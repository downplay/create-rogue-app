import { useTexture } from "@react-three/drei"
import { atomFamily } from "jotai/utils"
import { useMemo } from "react"
import { isArray } from "remeda"
import {
    Color,
    DataTexture,
    ObjectSpaceNormalMap,
    RedFormat,
    RepeatWrapping,
    TangentSpaceNormalMap,
    Vector2
} from "three"

const TOON_COLORS = 10

const colors = new Uint8Array(TOON_COLORS)

for (let c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256
}
// TODO: Really we should check the renderer for support but it means we must add a system for generating and sharing
// materials within React context, possibly actually inside atoms, and we need a three context atom as well.
// Primarily we just need to avoid instancing the same material a bunch of times.
// const format = renderer.capabilities.isWebGL2 ? THREE.RedFormat : THREE.LuminanceFormat
const format = RedFormat
const gradientMap = new DataTexture(colors, colors.length, 1, format)
gradientMap.needsUpdate = true

export const makeToonMaterial = (hue: number, sat: number = 0.5, lum: number = 1) => {
    const diffuseColor = new Color().setHSL(hue, sat, lum)
    // .multiplyScalar(1 - beta * 0.2)

    const material = <meshToonMaterial color={diffuseColor} gradientMap={gradientMap} />

    // const material = new MeshToonMaterial({
    //     color: diffuseColor,
    //     gradientMap: gradientMap
    // })

    return material
}

export const makeMetalMaterial = (colorValue: string | [number, number, number]) => {
    const color = isArray(colorValue)
        ? new Color().setHSL(colorValue[0], colorValue[1], colorValue[2])
        : new Color(colorValue)
    // TODO: Would be nice to make a metallic toon texture. Need to use texture and envmaps anyway to
    // make it more metally.
    const material = <meshStandardMaterial color={color} metalness={0.6} roughness={0.313} />
    return material
}

export const makeGlassMaterial = (hue: number, sat: number = 0.5, lum: number = 1) => {
    const color = new Color().setHSL(hue, sat, lum)
    return (
        <meshPhysicalMaterial
            color={color}
            transmission={1}
            thickness={0.5}
            roughness={0.2}
            transparent={true}
            opacity={0.9}
            ior={1.3}
            iridescenceIOR={1.5}
            alphaTest={0.5}
        />
    )
}

export type Textures = [base: string, height: string, normal: string, rough: string, ao: string]

const NORMAL_SCALE = new Vector2(0.2, 0.2)

export const useTextureMaterial = (textures: Textures) => {
    // TODO: Optimise more so this uses atom families for caching rather than useMemo
    const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useTexture(
        textures,
        (t) => {
            ;(isArray(t) ? t : [t]).forEach((t) => {
                t.wrapS = RepeatWrapping
                t.wrapT = RepeatWrapping
                t.repeat.set(2, 2)
            })
        }
    )

    return useMemo(
        () => (
            // <meshPhysicalMaterial
            <meshStandardMaterial
                displacementScale={0.01}
                map={colorMap}
                // TODO: Figure out displacement not really working and
                // also masking item (could set fake physic floor at 0.2 units above 0)
                displacementMap={displacementMap}
                normalMap={normalMap}
                normalScale={NORMAL_SCALE}
                // normalMapType={TangentSpaceNormalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
                aoMapIntensity={1}
                // reflectivity={1}
            />
        ),
        [colorMap, displacementMap, normalMap, roughnessMap, aoMap]
    )
}

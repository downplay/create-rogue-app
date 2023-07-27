import { Color, DataTexture, RedFormat } from "three"

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

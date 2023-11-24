import { useMemo } from "react"
import { Quad } from "../../model/spacial"
import { Floor } from "./FloorRender"
import { WallMerged } from "./WallRender"
// TODO: Maybe rename height to depth to be less confusing and use height for actual height

// Basic stone room
// TODO: Integrate heromap. Build room out of many tiles rather than single
// big floor. Makes it easier to carve door holes. Do it Vaults-like, pick maps
// and define entrances then connect them up to map.
export const Room = ({ id, area }: { id: string; area: Quad }) => {
    const walls = useMemo(
        () => [
            { key: "L", area: { x: area.x - 1, y: area.y, width: 1, height: area.height } },
            {
                key: "R",
                area: { x: area.x + area.width, y: area.y, width: 1, height: area.height }
            },
            { key: "T", area: { x: area.x, y: area.y - 1, width: area.width, height: 1 } },
            {
                key: "B",
                area: { x: area.x, y: area.y + area.height, width: area.width, height: 1 }
            }
        ],
        [area]
    )
    return (
        <>
            <Floor area={area} />
            {walls.map((wall) => (
                <WallMerged key={wall.key} area={wall.area} />
            ))}
        </>
    )
}

import { useCallback, useMemo } from "react"
import { Quad, UNITS_PER_CELL } from "../../model/dungeon"
import { Vector3 } from "three"
import { ThreeEvent } from "@react-three/fiber"
import { useAtom } from "jotai"
import { heroControlAtom } from "../../model/hero"

// TODO: Floor/wall can be extracted as a "Tile" component with a height range and material

// TODO: Maybe rename height to depth to be less confusing and use height for actual height

const FLOOR_DEFAULT_MATERIAL = <meshStandardMaterial color="darkslategrey" />

const Floor = ({ area }: { area: Quad }) => {
    const [heroControl, setHeroControl] = useAtom(heroControlAtom)

    const boxArgs = useMemo(
        () =>
            [area.width * UNITS_PER_CELL, 1, area.width * UNITS_PER_CELL] as [
                number,
                number,
                number
            ],
        [area]
    )
    const boxPosition = useMemo(
        () =>
            new Vector3(
                (area.x + area.width / 2) * UNITS_PER_CELL,
                -0.5,
                (area.y + area.height / 2) * UNITS_PER_CELL
            ),

        [area]
    )

    const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
        const gameX = e.point.x / UNITS_PER_CELL
        const gameY = e.point.z / UNITS_PER_CELL
        setHeroControl({
            type: "WalkTo",
            target: { x: gameX, y: gameY }
        })
    }, [])

    // TODO: Handle mouse move etc events and display a target
    return (
        <mesh position={boxPosition} receiveShadow onClick={handleClick}>
            <boxGeometry args={boxArgs} />
            {FLOOR_DEFAULT_MATERIAL}
        </mesh>
    )
}

const WALL_DEFAULT_MATERIAL = <meshStandardMaterial color="lightslategrey" />

const Wall = ({ area }: { area: Quad }) => {
    const boxArgs = useMemo(
        () =>
            [area.width * UNITS_PER_CELL, 10, area.height * UNITS_PER_CELL] as [
                number,
                number,
                number
            ],
        [area]
    )
    const boxPosition = useMemo(
        () =>
            new Vector3(
                (area.x + area.width / 2) * UNITS_PER_CELL,
                5,
                (area.y + area.height / 2) * UNITS_PER_CELL
            ),
        [area]
    )
    return (
        <mesh position={boxPosition} receiveShadow>
            <boxGeometry args={boxArgs} />
            {WALL_DEFAULT_MATERIAL}
        </mesh>
    )
}

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
                <Wall key={wall.key} area={wall.area} />
            ))}
        </>
    )
}

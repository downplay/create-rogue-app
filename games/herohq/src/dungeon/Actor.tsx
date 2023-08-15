import { useLocationToPosition, useLocationToRotation } from "./helpers"
import { LocationData, RenderModule, useActor, useData, useModule } from "../model/actor"
import { useCallback, useMemo } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { UNITS_PER_CELL } from "../model/dungeon"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { heroControlAtom, activeHeroAtom, activeHeroIdAtom } from "../model/hero"
import { InteractionAction } from "../model/player"

const selectedInteractionActorIdAtom = atom<string | undefined>(undefined)

export const Actor = ({ id }: { id: string }) => {
    const location = useData(LocationData, id)
    const [actor, dispatch] = useActor(id)
    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)
    const activeHeroId = useAtomValue(activeHeroIdAtom)
    // const setHeroControl = useSetAtom(heroControlAtom)

    const Renderer = useModule(RenderModule, id)

    // TODO: Maybe there's a case for just using local state rather than
    const [selectedInteractionActorId, setSelectedInteractionActorId] = useAtom(
        selectedInteractionActorIdAtom
    )

    const handleClick = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            console.log("INTERACTION")
            e.stopPropagation()
            if (activeHeroId) {
                dispatch(InteractionAction, {
                    interactor: activeHeroId,
                    point: e.point,
                    mode: "perform"
                })
            }
            // const gameX = e.point.x / UNITS_PER_CELL
            // const gameY = e.point.z / UNITS_PER_CELL
            // setHeroControl({
            //     type: "WalkTo",
            //     target: { x: gameX, y: gameY }
            // })
        },
        [activeHeroId]
    )

    const handleSelect = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            setSelectedInteractionActorId(id)
            if (activeHeroId) {
                dispatch(InteractionAction, {
                    interactor: activeHeroId,
                    point: e.point,
                    mode: "previewOn"
                })
            }
        },
        [activeHeroId]
    )

    const handleDeselect = useCallback(
        (e: ThreeEvent<MouseEvent>) => {
            setSelectedInteractionActorId(undefined)
            if (activeHeroId) {
                dispatch(InteractionAction, {
                    interactor: activeHeroId,
                    point: e.point,
                    mode: "previewOff"
                })
            }
        },
        [activeHeroId]
    )

    const isSelected = useMemo(
        () => selectedInteractionActorId === id,
        [selectedInteractionActorId]
    )

    // TODO: Also hover state outline etc
    return (
        <group
            position={position}
            rotation={rotation}
            onClick={handleClick}
            onPointerOver={handleSelect}
            onPointerOut={handleDeselect}>
            <Renderer id={id} selected={isSelected} />
        </group>
    )
}

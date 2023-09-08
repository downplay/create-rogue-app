import { useLocationToPosition, useLocationToRotation } from "./helpers"
import {
    LocationData,
    RenderModule,
    useActor,
    useAtomRef,
    useData,
    useModule
} from "../model/actor"
import { PropsWithChildren, RefObject, useCallback, useMemo, useRef } from "react"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { activeHeroIdAtom } from "../model/hero"
import { InteractionAction } from "../model/player"
import { Select } from "@react-three/postprocessing"
import { RapierRigidBody } from "@react-three/rapier"
import { Vector3 } from "three"

const selectedInteractionActorIdAtom = atom<string | undefined>(undefined)

export const Actor = ({ id }: { id: string }) => {
    const Renderer = useModule(RenderModule, id)

    const [selectedInteractionActorId, setSelectedInteractionActorId] = useAtom(
        selectedInteractionActorIdAtom
    )

    const isSelected = useMemo(
        () => selectedInteractionActorId === id,
        [selectedInteractionActorId]
    )

    // TODO: Also hover state outline etc
    return <Renderer id={id} selected={isSelected} mode="game" />
}

export const SelectableActor = ({ id, children }: PropsWithChildren<{ id: string }>) => {
    const [actor, dispatch] = useActor(id)
    const activeHeroId = useAtomValue(activeHeroIdAtom)

    // TODO: Selection should be another module and implement the wrapper automatically,
    // also we should automatically get a ref to the three entity so we can apply handlers rather
    // than having to add another group which probably has performance implications at scale
    // TODO: Maybe there's a case for just using local state rather than an atom here
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

    return (
        <Select enabled={isSelected}>
            <group onClick={handleClick} onPointerOver={handleSelect} onPointerOut={handleDeselect}>
                {children}
            </group>
        </Select>
    )
}

/**
 * Binds location and position to group
 *
 * TODO: Get a ref to the group and update imperatively for optimisation (although this
 * type will be rarer most likely)
 *
 * @param param0
 * @returns
 */
export const NonPhysicsActor = ({ id, children }: PropsWithChildren<{ id: string }>) => {
    const location = useData(LocationData, id)
    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)

    return (
        <group position={position} rotation={rotation}>
            {children}
        </group>
    )
}

/**
 * Assigns initial position and rotation to the rigidbody. Subsequent movements of the rigidbody
 * will apply back to the entity location.
 *
 * TODO: Even store full-on physics properties such as angular/linear velocity so we can restore
 * the whole world accurately. (Then WithToss wrapper is no longer needed since we'll initial these
 * anyway we can initialise with random values.)
 * @param param0
 */
export const PhysicsActor = ({
    id,
    bodyRef,
    children
}: PropsWithChildren<{ id: string; bodyRef: RefObject<RapierRigidBody> }>) => {
    // TODO: Maybe we should wrap a context here so children can all coordinate the physics
    // stuff

    const init = useRef(false)
    const locationFamily = LocationData.family(id)
    const location = useAtomRef(locationFamily)
    const setLocation = useSetAtom(LocationData.family(id))
    useFrame(() => {
        if (!init.current) {
            if (bodyRef.current) {
                bodyRef.current.setTranslation(
                    new Vector3(location.current.position.x, 0, location.current.position.y),
                    false
                )
                init.current = true
            }
            return
        }

        if (bodyRef.current) {
            const pos = bodyRef.current.translation()
            if (pos.x !== location.current.position.x || pos.z !== location.current.position.y) {
                setLocation((l) => ({ ...l, position: { x: pos.x, y: pos.z } }))
            }
        }
    })

    return children
}

import { useAtomValue } from "jotai"

import { actorLocationFamily } from "../model/hero"
import { HumanRender } from "./characters/HumanRender"
import { useLocationToPosition, useLocationToRotation } from "./helpers"

export const Hero = ({ id }: { id: string }) => {
    // const hero = useAtomValue(heroFamily(id))
    const location = useAtomValue(actorLocationFamily("Hero:" + id))

    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)
    return (
        <group position={position} rotation={rotation}>
            <HumanRender id={id} />
        </group>
    )
}

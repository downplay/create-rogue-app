import { useAtomValue } from "jotai"

import { HumanRender } from "./characters/HumanRender"
import { useLocationToPosition, useLocationToRotation } from "./helpers"
import { definitionForMonster } from "./monsters"
import { actorLocationFamily } from "../model/actor"

export const Actor = ({ id }: { id: string }) => {
    const monster = useAtomValue(actorFamily(id))

    const def = definitionForMonster(monster.type)

    const location = useAtomValue(actorLocationFamily(id))

    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)

    return (
        <group position={position} rotation={rotation}>
            <HumanRender id={id} />
        </group>
    )
}

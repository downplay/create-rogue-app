import { useAtomValue } from "jotai"

import { HumanRender } from "./characters/HumanRender"
import { useLocationToPosition, useLocationToRotation } from "./helpers"
import { definitionForMonster } from "./monsters"
import { LocationData, RenderModule, actorLocationFamily, useModule } from "../model/actor"

export const Actor = ({ id }: { id: string }) => {
    const monster = useAtomValue(actorFamily(id))

    const def = definitionForMonster(monster.type)

    const location = useData(LocationData, id)

    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)

    const [Renderer] = useModule(RenderModule, id)

    return (
        <group position={position} rotation={rotation}>
            <Renderer id={id} />
        </group>
    )
}

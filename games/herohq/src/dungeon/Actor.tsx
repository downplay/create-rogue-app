import { useLocationToPosition, useLocationToRotation } from "./helpers"
import { LocationData, RenderModule, useData, useModule } from "../model/actor"

export const Actor = ({ id }: { id: string }) => {
    const location = useData(LocationData, id)

    const position = useLocationToPosition(location)
    const rotation = useLocationToRotation(location)

    const Renderer = useModule(RenderModule, id)

    return (
        <group position={position} rotation={rotation}>
            <Renderer id={id} />
        </group>
    )
}

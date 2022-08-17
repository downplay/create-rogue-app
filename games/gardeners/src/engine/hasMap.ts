import { build, MapNode } from "@hero/map"
import { vector } from "@hero/math"
import { hasPosition } from "../game/mechanics/hasPosition"
import { withRng } from "../hooks/useRng"
import { onCreate } from "./action"
import { getEngine } from "./entity"
import { hasChildren } from "./hasChildren"

export const hasMap = (map: MapNode, scope?: Record<string, any>) => {
    const rng = withRng()
    const engine = getEngine()
    // TODO: Build should be deferred until stories have run to populate scope
    const result = build(map, rng, scope)
    const [position, setPosition] = hasPosition()
    const { add, remove } = hasChildren()
    setPosition(vector(-result.bounds.width / 2, 0, -result.bounds.height / 2))
    // TODO: Adjust camera to the bounds
    onCreate(() => {
        for (const cell of result.cells) {
            for (const element of cell.element) {
                // TODO: How to position the child? We could create a root node
                // and pass it to the child; the setup also needs rehydrating on
                // deserialization. Alternatively we have a positioning entity as well
                // but it feels inefficient, doubling the number of entities across
                // the board. Basically we need a module that can attach to the child
                // to handle the node relation
                const position = vector(cell.x, 0, cell.y)
                add(
                    engine.entities.create(
                        element.type in map.externals ? map.externals[element.type] : element.type,
                        element.params
                    ),
                    position
                )
            }
        }
    })
    return result
}

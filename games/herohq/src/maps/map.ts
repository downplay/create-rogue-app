import { build, MapNode } from "@hero/map"
import { RNG, vector } from "@hero/math"
import { ActorDefinition, actorFamily, LocationData } from "../model/actor"
import { Getter, Setter } from "jotai"
import { v4 } from 'uuid';
import { isFunction } from "remeda";
import { EntityData, RoomGeneratorProps } from "../model/generators";
import { MapResult } from "@hero/map/src/build";

type MapExternalContext = RoomGeneratorProps &  {
    map:  MapNode<MapExternals>
    result: MapResult
}

export type MapExternals = ActorDefinition | EntityData | ((context: MapExternalContext) => EntityData)

export const defineMap = (name: string, map: MapNode<MapExternals>) => {
    // TODO: This will need to be in set-atom mode so we can use get/set in the interpolation callbacks
    return {
        build: (get:Getter,set:Setter,rng: RNG) => {
            const scope = {}
            const result = build(map, rng)

            const position = vector(-result.bounds.width / 2, 0, -result.bounds.height / 2)

            const context = {
                ...scope,
                map,
                result
            }

            for (const cell of result.cells) {
                for (const element of cell.element) {
                        const position = vector(cell.x, 0, cell.y)
                        const id = "Map:" + name + ":" + v4()
                        if (element.type in map.externals) {
                            // Find out what we're dealing with
                            const actor = map.externals[element.type]
                            if (isFunction(actor)) {
                                const result = actor(context)

                        } else if (actor.type === "ACTOR") {
                            set(actorFamily(id), {
                                type: "initialize",
                                actor: element as unknown as ActorDefinition,
                                data: [
                                    [LocationData, 
                                ]
                            })
                        }
                    } else {
                        throw new Error("Unknown actor instance type: " + element.type)
                    }

                    }

                        add(
                            engine.entities.create(
                                element.type in map.externals
                                    ? map.externals[element.type]
                                    : element.type,
                                element.params
                            ),
                            position
                        )
                    }
                }
            })
        }
    }
    return result
}

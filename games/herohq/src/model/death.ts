import { isArray } from "remeda"
import {
    ActorDefinition,
    DataSpec,
    LocationData,
    actorFamily,
    defineAction,
    defineModule
} from "./actor"

// TODO: Could be another use case for HeroText? Makes it easy to weight items, merge definitinos together,
// come up with more creative definitions for artifact items, etc etc
// In fact the whole death sequence can be storied allowing us to have more interesting death timelines

// Lines should also be able to contain subtables so this would be a decent way of implementing that

type DropTableLineOptions = number | { chance?: number; amount?: number }

type DropTableLine = [type: ActorDefinition, options: DropTableLineOptions, data: DataSpec<any>[]]

export type DropTable = DropTableLine[]

type DeathModuleOpts = {
    drops: DropTable
    // TODO: Probably allow multiple corpses too. Really it's just an extension of droptable and maybe
    // could be first item in droptable? Only complication is we have to pass the properties (maybe
    // a copyData prop on drop line rather than special treatment, this way we can do what we want,
    // and even randomly switch different corpses)
    // Of course utilising herotext would solve this and other problems, just need to think of a nice
    // way to do it that still works with the modules system.
    corpse: ActorDefinition | [type: ActorDefinition, data: DataSpec<any>[]]
    // TODO: And how to define how our data is mapped over to the corpse data
}

export const DieAction = defineAction<{ killer: string }>("Die")

export const DeathModule = defineModule(
    "Death",
    () => {
        // TODO: Send a flag here to handle corpsification?
        // We need to gather up positions/connections of all 3D parts to rebuild them
        // as ragdoll in next component
    },
    ({ drops, corpse }: DeathModuleOpts, { id, handle, get, setAtom, rng, spawn }) => {
        // TODO: Use the killer information to go and update player stats about total kills.
        handle(DieAction, () => {
            const location = get(LocationData)
            for (const d of drops) {
                const [type, options, data] = d
                const { chance, amount } = {
                    ...{ chance: 1, amount: 1 },
                    ...(typeof options === "number" ? { amount: 1, chance: options } : options)
                }
                if (chance === 1 || rng.next() <= chance) {
                    for (let n = 0; n < amount; n++) {
                        // TODO: Randomize location for each spawn (but also velocity and spin)
                        spawn(type, [...data, [LocationData, location]])
                    }
                }
            }
            // TODO: Fire an event to gather any other data of significance we need to transfer over to the corpse
            spawn(isArray(corpse) ? corpse[0] : corpse, [
                ...(isArray(corpse) ? corpse[1] : []),
                [LocationData, location]
            ])

            // Finally destroy self
            setAtom(actorFamily(id), { type: "destroy" })
        })
    }
)

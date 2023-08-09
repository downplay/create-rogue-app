import { atomFamily, atomWithStorage } from "jotai/utils"
import { Position } from "./dungeon"
import { ComponentType } from "react"
import { Random } from "random"

export type ActorProps = {
    id: string
}

// type ModuleCommand<Opts> =
//     | {
//           type: "Initialize"
//           opts: Opts
//       }
//     | {
//           type: "Event"
//       }

type ActionDefinition<T> = {
    type: "ACTION"
    name: string
    defaultPayload?: T
}

type DataDefinition<Data> = {
    type: "DATA"
    name: string
    defaultValue: Data
}

type ModuleGetterContext = {
    id: string
    get: ValueGetter
}

type ActionHandler = <T>(action: ActionDefinition<T>, handler: (payload: T) => void) => void
type ActionDispatcher = <T>(
    action: ActionDefinition<T>,
    payload: T,
    /* For now it's the id but maybe we need an INSTANCE or ENTITY type */
    actorId?: string
) => void

type ValueGetter = <Data>(value: ModuleDefinition<any, Data> | DataDefinition<Data>) => Data

type DataInterface<Data> = {
    value: Data
    set: (nextValue: Data | ((prev: Data) => Data)) => void
}

type DataGetter = <Data>(data: DataDefinition<Data>) => DataInterface<Data>

type ModuleContext<Get> = ModuleGetterContext & {
    handle: ActionHandler
    dispatch: ActionDispatcher
    data: DataGetter
    self: () => Get
    rng: Random
}

type ModuleGetter<Opts, Get> = (opts: Opts, context: ModuleContext<Get>) => Get
type ModuleInitializer<Opts, Get> = (opts: Opts, context: ModuleContext<Get>) => void

type ModuleDefinition<Opts, Get> = {
    type: "MODULE"
    name: string
    getter: ModuleGetter<Opts, Get>
    initialize?: ModuleInitializer<Opts, Get>
}

export const defineModule = <Opts extends {} = {}, Get = undefined>(
    name: string,
    getter: ModuleGetter<Opts, Get>,
    initialize?: ModuleInitializer<Opts, Get>
): ModuleDefinition<Opts, Get> => {
    return { type: "MODULE", name, getter, initialize }
}

// initialize: (data:Data, opts:Opts, set:Setter)=>Data|undefined) => {
//     return {
//         name,
//         defaultData,
//         family: atomFamily((id: string) => {
//             return atom(
//                 () => {},
//                 (get,set,update: ModuleCommand) => {}
//             )
//         })
//     }
// }

export const defineAction = <Payload>(
    name: string,
    defaultPayload?: Payload
): ActionDefinition<Payload> => {
    {
        return {
            type: "ACTION",
            name,
            defaultPayload
        }
    }
}

export const defineData = <Data>(name: string, defaultValue: Data): DataDefinition<Data> => {
    return {
        type: "DATA",
        name,
        defaultValue
    }
}

type ModuleSpec<Data, Opts> = [module: ModuleDefinition<Data, Opts>, options: Opts]

export const defineActor = (name: string, modules: ModuleSpec<any, any>[]) => {
    return {
        type: "ACTOR",
        name,
        modules
    }
}

// export const actorFamily = atomFamily((id: string, def: ActorDefinition) =>
//     atom(
//         () => ({ id }),
//         (get, set, update: ActorEvent) => {}
//     )
// )

// export type Actor = {
//     id: string
//     name?: string
//     level: number
//     status: string
// }

export const GameLoopAction = defineAction<{ time: number; delta: number }>("GameLoop")

type RenderModuleOpts = {
    renderer?: ComponentType<ActorProps>
}

const DefaultRenderer = ({ id }: { id: string }) => id

export const RenderModule = defineModule(
    "Render",
    ({ renderer = DefaultRenderer }: RenderModuleOpts) => renderer
)

const LevelData = defineData("Level", 1)

const LevelUpgradeModule = defineModule<{}, { level: number; upgradeCost: number }>(
    "LevelUpgrade",
    ({}, { get }) => {
        const level = get(LevelData)
        return {
            level,
            upgradeCost: Math.pow(2, level) * 10
        }
    }
)

// const GainXPAction = defineAction("GainXP")
// const GainLevelAction = defineAction("GainLevel")

// const LevelModule = defineModule("Level", ({update,action})=>{
//         action(GainXPAction, ()=>{

//         })
// })

export const actorDataFamily = <T>(datum: string, defaultValue: T) => {
    return atomFamily((id: string) => atomWithStorage("Actor:" + id + ":" + datum, defaultValue))
}

// const actorCurrentHealthFamily = actorDataFamily("Health", 1)

const CurrentHealthData = defineData("CurrentHealth", 1)

const MaxHealthModule = defineModule<HealthModuleOpts, number>(
    "MaxHealth",
    ({ multiplier = 1 }, { id, get }) => {
        const level = get(LevelData)
        // TODO: Hero will have a series of upgrades which may affect health as well as
        // body stat, equips and temporary effects
        return Math.ceil((10 + level * 2) * multiplier)
    }
)

type HealthModuleOpts = {
    multiplier?: number
}

const HealthModule = defineModule(
    "Health",
    ({}, { id, get }) => {
        const maximum = get(MaxHealthModule)
        const fraction = get(CurrentHealthData)
        return {
            hp: Math.round(fraction * maximum),
            fraction,
            maximum
        }
    },
    ({}) => {}
)

export type Vital = {
    hp: number
    fraction: number
    maximum: number
}

// export const heroVitalsFamily = atomFamily((id: string) => {
//     return atom((get) => ({
//         health: get(heroHealthFamily(id))
//     }))
// })

// export const vitalsModule = defineModule < Vitals

// type ActorJob = {

// }

// export const heroJobFamily =  atomFamily((id: string) => atomWithStorage()

export type ActorLocation = {
    location: string
    room?: string
    position: Position
    direction: number
    // TODO: Also a target for their head so we can make it look at something else
    // but this should be determined a different way
}

const DEFAULT_ACTOR_LOCATION: ActorLocation = {
    // TODO: Perhaps which floor/room they are in should be in a separate atom. Since this
    // can be used as a partition to determine whether we need to compute anything else
    // about them, and will also place them in the render list or not (which will also control
    // mounting of any atoms related to render)
    // If they are not in a "currently observed" location then we shouldn't send normal game ticks
    // (maybe much less regular "background update" ticks to handle automation, healing etc.)
    location: "Dungeon:1",
    position: { x: 5, y: 5 },
    direction: 0
}

export const LocationData = defineData("Location", DEFAULT_ACTOR_LOCATION)

// TODO: Maybe we should even split position into its own atom since it gets updated frequently
// but things that will change from room don't need to be updated so frequently
// export const LocationModule = defineModule(
//     "Location",
//     () => {
//         switch (update.type) {
//         }
//     }
//     // return atomWithStorage<ActorLocation>(id + ":Location", DEFAULT_ACTOR_LOCATION)
// )

// export const actorMovementFamily = atomFamily((id: string) => {
//     return atomWithStorage<ActorMovement>(id + ":Movement", {})
// })

/**
 * Speed in cells/sec
 */
// export const actorSpeedFamily = atomFamily((id: string) => {
//     return atom((get) => {
//         // const actor =
//         // Calculate with small modifiers for level, agility, athletics, plus any potion effects.
//         return 2.5
//     })
// })

type SpeedModuleOpts = {
    base?: number
}

export const SpeedModule = defineModule("Speed", ({ base = 2.5 }: SpeedModuleOpts) => {
    //         // const actor =
    //         // Calculate with small modifiers for level, agility, athletics, plus any potion effects.
    return base
})

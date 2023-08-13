import { atomFamily, atomWithStorage } from "jotai/utils"
import { ComponentType, useCallback } from "react"
import { Random } from "random"
import { Getter, PrimitiveAtom, Setter, WritableAtom, atom, useAtom, useAtomValue } from "jotai"
import { AtomFamily } from "jotai/vanilla/utils/atomFamily"
import { isArray } from "remeda"
import { makeRng } from "./rng"
import { Position } from "./spacial"

export type ActorProps = {
    id: string
    selected: boolean
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

export type DataDefinition<Data> = {
    type: "DATA"
    name: string
    defaultValue: Data
    family: AtomFamily<string, PrimitiveAtom<Data>>
}

type ModuleGetterContext = {
    id: string
    get: ValueGetter
    getAtom: Getter
}

type ActionHandler = <T>(action: ActionDefinition<T>, handler: (payload: T) => void) => void
type ActionDispatcher = <T>(
    action: ActionDefinition<T>,
    payload: T,
    /* For now it's the id but maybe we need an INSTANCE or ENTITY type */
    actorId?: string
) => void

type ValueGetter = <Data>(
    value: ModuleDefinition<any, Data> | DataDefinition<Data>,
    actorId?: string
) => Data

// type DataInterface<Data> = {
//     value: Data
//     set: (nextValue: Data | ((prev: Data) => Data)) => void
// }

// type DataGetter = <Data>(data: DataDefinition<Data>) => DataInterface<Data>

type ModuleContext<Get> = ModuleGetterContext & {
    handle: ActionHandler
    dispatch: ActionDispatcher
    set: <Data>(data: DataDefinition<Data>, nextValue: Data | ((prev: Data) => Data)) => void
    setAtom: Setter
    self: () => Get
    rng: Random
}

type ModuleGetter<Opts, Get> = (opts: Opts, context: ModuleGetterContext) => Get
type ModuleInitializer<Opts, Get> = (opts: Opts, context: ModuleContext<Get>) => void

type ModuleUpdate<Opts> =
    | {
          type: "initialize"
          opts: Opts
      }
    | {
          type: "action"
          action: ActionDefinition<any>
          payload: any
      }
    | {
          type: "hydrate"
      }
    | {
          type: "destroy"
      }

type ModuleDefinition<Opts, Get> = {
    type: "MODULE"
    name: string
    getter: ModuleGetter<Opts, Get>
    initialize?: ModuleInitializer<Opts, Get>
    family: AtomFamily<string, WritableAtom<Get, [ModuleUpdate<Opts>], void>>
}

export const defineModule = <Opts extends {} = {}, Get = undefined>(
    name: string,
    getter: ModuleGetter<Opts, Get>,
    initialize?: ModuleInitializer<Opts, Get>,
    defaultOpts?: Opts
): ModuleDefinition<Opts, Get> => {
    return {
        type: "MODULE",
        name,
        getter,
        initialize,
        family: atomFamily((id: string) => {
            const optsAtom = atom<Opts>((defaultOpts || ({} as Opts))!)
            const handlers: Record<string, ((payload: any) => void)[]> = {}
            const self = atom(
                (get) => {
                    const readContext: ModuleGetterContext = {
                        id,
                        get: (value, actorId) => get(value.family(actorId || id)),
                        getAtom: get
                    }
                    const opts = get(optsAtom)
                    return getter(opts, readContext)
                },
                (get, set, update: ModuleUpdate<Opts>) => {
                    switch (update.type) {
                        case "initialize":
                            set(optsAtom, update.opts)
                            if (initialize) {
                                const writeContext: ModuleContext<Get> = {
                                    id,
                                    get: (value) => get(value.family(id)),
                                    set: (data, nextValue) => set(data.family(id), nextValue),
                                    getAtom: get,
                                    setAtom: set,
                                    handle: (action, handler) => {
                                        handlers[action.name] ||= []
                                        handlers[action.name].push(handler)
                                        // TODO: Do we need some cleanup? Can actions be added/removed?
                                    },
                                    dispatch: (action, payload, actorId) => {
                                        if (actorId) {
                                            set(actorFamily(actorId), {
                                                type: "action",
                                                action,
                                                payload
                                            })
                                        } else if (handlers[action.name]) {
                                            for (const h of handlers[action.name]) {
                                                h(payload)
                                            }
                                        }
                                    },
                                    self: () => get(self),
                                    rng: makeRng(id)
                                }

                                initialize(update.opts, writeContext)
                            }
                            break
                        case "action":
                            if (handlers[update.action.name]) {
                                for (const h of handlers[update.action.name]) {
                                    h(update.payload)
                                }
                            }
                            break
                    }
                }
            )
            return self
        })
    }
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

type ActorUpdate =
    | {
          type: "initialize"
          actor: ActorDefinition
          data: DataSpec<any>[]
      }
    | {
          type: "action"
          action: ActionDefinition<any>
          payload: any
      }
    | {
          type: "hydrate"
      }
    | {
          type: "destroy"
      }

export const defineData = <Data>(name: string, defaultValue: Data): DataDefinition<Data> => {
    return {
        type: "DATA",
        name,
        defaultValue,
        family: atomFamily((id: string) =>
            atomWithStorage("Actor:" + id + ":" + name, defaultValue)
        )
    }
}

const ActorTypeData = defineData("ActorType", "Unknown")

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

export type ModuleSpec<Data, Opts> =
    | [module: ModuleDefinition<Data, Opts>, options: Opts]
    | ModuleDefinition<Data, Opts>

export type DataSpec<Data> = [data: DataDefinition<Data>, value: Data]

export type ActorDefinition = {
    type: "ACTOR"
    name: string
    modules: ModuleSpec<any, any>[]
}

export const defineActor = (name: string, modules: ModuleSpec<any, any>[]): ActorDefinition => {
    return {
        type: "ACTOR",
        name,
        modules
    }
}

// TODO: Just a bit worried about having an atomic array for this. If we create and destroy
// a large number of actors this op will get pretty expensive. Could end up more efficient to mutate
// this array and find a way of only updating atoms for the important derived stuff (e.g. visible actors)
export const actorIdsAtom = atom<string[]>([])
// export const actorIdsAtom = atomWithStorage<string[]>("Actors", [])

// TODO: use splitatom to make it more efficient?
export const actorsAtom = atom((get) => get(actorIdsAtom).map((id) => actorFamily(id)))

export type Actor = { id: string; modules: ModuleDefinition<any, any>[] }

export type ActorAtom = WritableAtom<Actor, [ActorUpdate], void>

export const actorFamily = atomFamily((id: string) => {
    const modules: ModuleDefinition<any, any>[] = []
    return atom(
        (get) => {
            return { id, modules } as Actor
        },
        (get, set, update: ActorUpdate) => {
            switch (update.type) {
                case "initialize":
                    set(ActorTypeData.family(id), update.actor.name)
                    // Initialize any data first
                    for (const d of update.data) {
                        set(d[0].family(id), d[1])
                    }
                    // Initialize modules
                    for (const m of update.actor.modules) {
                        const module = isArray(m) ? m[0] : m
                        const opts = isArray(m) ? m[1] || {} : {}
                        set(module.family(id), { type: "initialize", opts })
                        modules.push(module)

                        // module.initialize()
                    }
                    const newActors = get(actorIdsAtom).slice()
                    newActors.push(id)
                    set(actorIdsAtom, newActors)
                    break
                case "hydrate":
                    const actorType = get(ActorTypeData.family(id))
                    // TODO: We'll need to look up the actor somewhere and reinstate
                    // all their modules
                    throw new Error("Not implemented, rehydrate: " + actorType)
                    break
                case "destroy":
                    break
                case "action":
                    for (const m of modules) {
                        set(m.family(id), update)
                    }
                    break
            }
        }
    )
})

export const useData = <Data>(data: DataDefinition<Data>, id: string) => {
    const atom = data.family(id)
    const value = useAtomValue(atom)
    return value as Data
}

export const useModule = <Opts, Get>(module: ModuleDefinition<Opts, Get>, id: string) => {
    const atom = module.family(id)
    const value = useAtomValue(atom)
    return value as Get
}

export const useActor = (idOrAtom: string | ActorAtom) => {
    const [actor, setActor] = useAtom(
        typeof idOrAtom === "string" ? actorFamily(idOrAtom) : idOrAtom
    )
    const dispatch = useCallback(
        <T>(action: ActionDefinition<T>, payload: T) =>
            setActor({ type: "action", action, payload }),
        [setActor]
    )
    return [actor, dispatch] as const
}

export const GameLoopAction = defineAction<{ time: number; delta: number }>("GameLoop")

type RenderModuleOpts = {
    renderer?: ComponentType<ActorProps>
}

const DefaultRenderer = ({ id }: { id: string }) => id

export const RenderModule = defineModule(
    "Render",
    ({ renderer = DefaultRenderer }: RenderModuleOpts) => renderer,
    undefined,
    { renderer: DefaultRenderer }
)

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

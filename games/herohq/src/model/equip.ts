import { atom } from "jotai"
import { ActorProps, actorFamily, defineAction, defineData, defineModule } from "./actor"
import { AttackDefinition, DiscoverAttacksAction } from "./fight"
import { LevelData } from "./level"
import { isArray } from "remeda"
import { ComponentType, RefObject } from "react"
import { RapierRigidBody } from "@react-three/rapier"

const EQUIP_DEFAULTS = { slots: [] }

const EquipData = defineData<Record<string, string>>("Equip", {})

export type DragDropModel = {
    source: string
    target: string
    data: { id: string } & (
        | {
              type: "Equip"
              name: string
          }
        | {
              type: "Container"
              index: number
          }
    )
}

const DragDropAction = defineAction<DragDropModel>("DragDrop")

export const EquipModule = defineModule(
    "Equip",
    (_, { get }) => {
        return {
            slots: get(EquipData),
            canEquip: (id: string) => {
                // TODO: Must be careful here. We're loading the equipment module to check if the
                // equipment module actually exists. Would be better to have a has() method to
                // check it has the module without actually instantiating it
                const data = get(EquipmentModule, id)
                return isArray(data.slot) ? !!data.slot.length : !!data.slot
                // TODO: Also check if we the hero actually have the slot in question (for racial
                // stuff) as well as it being non-occupied by something cursed, or otherwise
                // in a non-equippable state e.g. being frozen or unconscious
            }
        }
    },
    (_, { handle, dispatch, get, set, self }) => {
        handle(DragDropAction, (payload) => {
            console.log("DRAGDROP", payload)
            // TODO: Player should be able to react to being equipped
            switch (payload.data.type) {
                case "Equip": {
                    const name = payload.data.name
                    const data = get(EquipmentModule, payload.source)
                    const slots = isArray(data.slot) ? data.slot : [data.slot]
                    console.log(slots, name)
                    if (slots.includes(name) && self().canEquip(payload.source)) {
                        set(EquipData, (data) => ({ ...data, [name]: payload.source }))
                    }
                    break
                }
                default:
                    throw new Error("Not handled DragDropAction: " + payload.data.type)
            }
        })

        // TODO: We probably need to route rather more actions to the equipment but we maybe
        // need to be more systematic about it
        handle(DiscoverAttacksAction, (payload) => {
            for (const id of Object.values(get(EquipData))) {
                dispatch(DiscoverAttacksAction, payload, id)
            }
        })
    },
    EQUIP_DEFAULTS
)

// TODO: Ok just think about this. Would be great to have an "omnidextrous" mutation. (Maybe there is
// a better biological term for this already). A hero with this can equip with their feet equally as their
// hands.

export type EquipActorProps = ActorProps & { handleRef: RefObject<RapierRigidBody> }

type EquipmentOpts = {
    renderer?: ComponentType<EquipActorProps>
    slot: string | string[]
    effects: { type: "attack"; attack: AttackDefinition }[]
}

// TODO: Maybe change name of this module (and maybe Equip module) as its too similar.
// Need "this accepts equipment" vs "this is equippable"
// TODO: Maybe consider that the item is the actor making the attack, not the hero?
export const EquipmentModule = defineModule<EquipmentOpts, EquipmentOpts>(
    "Equipment",
    (opts) => {
        return opts
    },
    (opts, { id, get, handle }) => {
        handle(DiscoverAttacksAction, ({ attacks }) => {
            // I guess this effect type is mainly for convenience. Almost anything
            // can be achieved if we have dynamic module binding here.
            for (const eff of opts.effects) {
                if (eff.type === "attack") {
                    attacks.push({
                        source: id,
                        attack: eff.attack,
                        power: get(LevelData)
                    })
                }
            }
        })
        /*
        // Proc effects on equip e.g. curses or special effects
        // Add modules
        handle(EquipAction)
        // Potentially prevent if cursed
        // Remove modules
        handle(UnequipAction)
        // How will stat computations work? Handler not really the right way, we want it to
        // work atomically so recomputation happens when needed, not every time we need the number
        handle(ComputeStatAction)
        */
    }
)

export const dispatchDropAtom = atom(
    () => {},
    (get, set, update: DragDropModel) => {
        console.log("DROP ATOM", update)
        set(actorFamily(update.data.id), {
            type: "action",
            action: DragDropAction,
            payload: update
        })
    }
)

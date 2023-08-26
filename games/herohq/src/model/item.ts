import {
    LocationData,
    actorFamily,
    defineAction,
    defineActor,
    defineData,
    defineModule
} from "./actor"
import { InteractionAction } from "./player"
import { GameLoopAction } from "./game"
import { WalkToAction } from "./movement"
import { CancelAction } from "./player"

export const LootTargetAction = defineAction<{
    target: string
}>("LootTarget")

export const LootTargetData = defineData<{
    target?: string
}>("LootTarget", {})

export const LootAction = defineAction<{ source: string }>("Loot")

export const TakeItemAction = defineAction<{ item: string }>("TakeItem")

// TOOD: Much of this copied from FightModule and it's the same concept; MoveTo then perform action.
// We want a generic system for this i.e. queueing a series of tasks, which of course must be serializable
// rather than callbacks, and then the cancelling thing can be a bit more automated as we'll just cancel
// an existing queue when we make a new one. (We could then queue up say multiple fights with shift-click
// or area select.)
export const LootModule = defineModule(
    "Loot",
    (_, { get }) => {
        // TODO: Maybe also a status as in "moving to" vs "fighting"
        // We would use this status to colour a theoretical path line on the floor, as well as show
        // hero status in the roster. Status can be set by a few different modules; need to work out
        // a system for this kind of data as we also need something to allow overriding/mutating stat
        // values for things like potion or spell effects
        return get(LootTargetData)
    },
    (_, { id, handle, set, get, dispatch }) => {
        const lootOrMove = (target: string) => {
            const location = get(LocationData)
            const targetLocation = get(LocationData, target)
            // TODO: Should be a helper (exists in heromath?)
            const distanceTo = Math.sqrt(
                Math.pow(targetLocation.position.x - location.position.x, 2) +
                    Math.pow(targetLocation.position.y - location.position.y, 2)
            )
            if (distanceTo <= 1) {
                dispatch(WalkToAction, { target: location.position })
                dispatch(LootAction, { source: id }, target)
                set(LootTargetData, {})
            } else {
                dispatch(WalkToAction, { target: targetLocation.position })
            }
        }

        handle(CancelAction, () => {
            set(LootTargetData, {})
        })
        handle(LootTargetAction, ({ target }) => {
            set(LootTargetData, { target })
            lootOrMove(target)
        })
        handle(GameLoopAction, () => {
            const { target } = get(LootTargetData)
            if (target) {
                lootOrMove(target)
            }
        })
    }
)

type ItemModuleOpts = {
    stackable: boolean
    currency: string
    valuePer: number
}

export const ItemData = defineData<{ amount: number }>("Item", { amount: 1 })

export const ItemModule = defineModule(
    "Item",
    ({ stackable, currency, valuePer }: ItemModuleOpts, { get }) => {
        const { amount } = get(ItemData)
        return {
            stackable,
            amount,
            currency,
            valuePer,
            value: valuePer * amount
        }
    },
    (opts: ItemModuleOpts, { id, handle, dispatch, setAtom }) => {
        handle(InteractionAction, ({ mode, interactor }) => {
            switch (mode) {
                case "perform":
                    dispatch(CancelAction, undefined, interactor)
                    dispatch(LootTargetAction, { target: id }, interactor)
                    break
                case "previewOn":
                case "previewOff":
                    // TODO: What we should do is change the user's cursor to a crosshair,
                    // display a red outline, display a red path on the ground, display popup
                    // of monster health/stats, etc etc etc
                    break
            }
        })

        handle(LootAction, ({ source }) => {
            // The flow is kinda screwed up here. The hero sends a lootaction to loot the item. The item
            // tells the hero to take item. But loot could also work in the case of a treasure chest which
            // instead would disperse further items on the ground.
            dispatch(TakeItemAction, { item: id }, source)
            // TODO: Actually we don't necessarily want to destroy this one.
            // If the source doesn't already have the item we'll change our location to their inventory.
            // If they have the item and it's stackable then adjust the count instead, then destroy.
            // setAtom(actorFamily(id), { type: "destroy" })
        })
    }
)

const ContainerData = defineData<string[]>("Container", [])

export const ContainerModule = defineModule("Container", (_, { get }) => {
    const data = get(ContainerData)
    return data.map((id) => actorFamily(id))
})

export const InventoryNode = defineActor("Inventory", [ContainerModule])

export const InventoryData = defineData<{ container?: string }>("Inventory", {})

export const InventoryModule = defineModule(
    "Inventory",
    (_, { get }) => {
        const container = get(InventoryData).container
        return container ? get(ContainerData, container) : []
    },
    (_, { get, getAtom, set, setAtom, spawn, handle, self, dispatch }) => {
        const data = get(InventoryData)
        let container = data.container
        if (!container) {
            container = spawn(InventoryNode)
            set(InventoryData, { container })
        }
        handle(TakeItemAction, ({ item }) => {
            const family = actorFamily(item)
            const actor = getAtom(family)
            // Do we already have this type and is it stackable?
            const { stackable, amount } = get(ItemModule, item)
            console.log("GETTING", actor.type, stackable, amount)
            const items = self()
            if (stackable) {
                const stack = items.find(
                    (itemId) => getAtom(actorFamily(itemId)).type === actor.type
                )
                if (stack) {
                    // TODO: Maybe should be a MutateStackSizeAction instead of poking around ItemData ourselves
                    setAtom(ItemData.family(stack), (i) => ({ ...i, amount: i.amount + amount }))
                    // Destroy original item
                    setAtom(family, { type: "destroy" })
                } else {
                    // TODO: We shouldn't need this teleport. Item location should be determined from its
                    // container parent. Moving it to the container should be enough. Maybe we need a MoveToContainer
                    // action (or maybe the TeleportAction is what should be setting ContainerData...?)
                    set(
                        LocationData,
                        { position: { x: 0, y: 0 }, location: "Inventory", direction: 0.5 },
                        item
                    )
                    set(ContainerData, [...items, item], container)
                }
            } else if (container) {
                // TODO: We shouldn't need this teleport. Item location should be determined from its
                // container parent. Moving it to the container should be enough. Maybe we need a MoveToContainer
                // action (or maybe the TeleportAction is what should be setting ContainerData...?)
                set(
                    LocationData,
                    { position: { x: 0, y: 0 }, location: "Inventory", direction: 0.5 },
                    item
                )

                set(ContainerData, [...items, item], container)
            }
        })
    }
)

const EQUIP_DEFAULTS = { slots: [] }

const EquipData = defineData<Record<string, string>>("Equip", {})

export const EquipModule = defineModule(
    "Equip",
    (_, { get }) => {
        return {
            slots: get(EquipData),
            canEquip: (id: string) => {}
        }
    },
    () => {},
    EQUIP_DEFAULTS
)

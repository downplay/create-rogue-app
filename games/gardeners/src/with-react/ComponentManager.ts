// TODO: Needs moving to @hero/react lib

import { Component, ComponentType } from "react"
import { onCreate, onDestroy } from "../engine/action"
import { defineEntity, defineGlobalInstance, getEngine } from "../engine/entity"
import { getGlobalInstance, useGlobalInstance } from "../engine/global"
import { defineData, hasData } from "../engine/data"

export type HasComponentOptions<T> = {
    visible?: boolean
    slot: string
    props: T
}

const ComponentVisibleData = defineData<boolean>("HasComponent_Visible")

let lastId = 0

export const ComponentManager = defineEntity("ComponentManager", () => {
    // const engine = getEngine()

    const slots: Record<
        string,
        Record<
            string,
            {
                component: ComponentType<any>
                props: any
            }
        >
    > = {}

    const get = (slot: string) => {
        // TODO: Removing and adding a component causes it to get a new id, so it won't remember
        // state
        console.log("getting slot", slot, slots[slot])
        return slots[slot] ? Object.entries(slots[slot]).map(([k, v]) => ({ id: k, ...v })) : []
    }

    const add = <T>(slot: string, component: ComponentType<T>, props: T) => {
        const id = (++lastId).toString()
        slots[slot] = slots[slot] || {}
        slots[slot][id] = { component, props }
        return id
    }

    const remove = (slot: string, id: string) => {
        delete slots[slot][id]
    }

    return {
        get,
        add,
        remove
    }
})

export const GlobalComponentManager = defineGlobalInstance(ComponentManager)

export const hasComponent = <T>(
    component: ComponentType<T>,
    { visible = true, props, slot }: HasComponentOptions<T>
) => {
    const [isVisible, updateVisible] = hasData(ComponentVisibleData, visible)
    const manager = getGlobalInstance(GlobalComponentManager)
    let handle: string
    const addComponent = () => {
        handle = manager.interface.add(slot, component, props)
    }

    const removeComponent = () => {
        manager.interface.remove(slot, handle)
    }

    // TODO: Not exactly "onCreate", maybe "onMount"? Or is this a case of "useEffect"?
    onCreate(() => {
        console.log("creating")
        if (isVisible.value) {
            addComponent()
        }
    })

    onDestroy(() => {
        removeComponent()
    })

    const show = (visible: boolean = true) => {
        if (isVisible.value && !visible) {
            removeComponent()
        } else if (!isVisible.value && visible) {
            addComponent()
        }
        updateVisible(visible)
    }

    return [show]
}

export const useComponentSlot = (name: string) => {
    const manager = useGlobalInstance(GlobalComponentManager)
    return manager.interface.get(name) || []
}

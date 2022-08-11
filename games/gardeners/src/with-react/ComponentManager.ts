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
    const engine = getEngine()

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
        // Timeout prevents an infinite refresh loop,
        // TODO: Do this more gracefully
        setTimeout(engine.refresh, 0)
        return id
    }

    const update = <T>(slot: string, id: string, props: T) => {
        slots[slot][id] = { ...slots[slot][id], props }
        // Timeout prevents an infinite refresh loop,
        // TODO: Do this more gracefully
        setTimeout(engine.refresh, 0)
    }

    const remove = (slot: string, id: string) => {
        delete slots[slot][id]
    }

    return {
        get,
        add,
        update,
        remove
    }
})

export const GlobalComponentManager = defineGlobalInstance(ComponentManager)

export const hasComponent = <T>(
    component: ComponentType<T>,
    { visible = true, props, slot }: HasComponentOptions<T>
): [show: (visible?: boolean) => void, update: (props: T) => void] => {
    const [isVisible, updateVisible] = hasData(ComponentVisibleData, visible)
    const manager = getGlobalInstance(GlobalComponentManager)
    let handle: string
    let currentProps = props
    const addComponent = () => {
        handle = manager.interface.add(slot, component, currentProps)
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

    const update = (props: T) => {
        currentProps = props
        if (isVisible.value) {
            manager.interface.update(slot, handle, props)
        }
    }

    return [show, update]
}

export const useComponentSlot = (name: string) => {
    const manager = useGlobalInstance(GlobalComponentManager)
    return manager.interface.get(name) || []
}

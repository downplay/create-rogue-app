import produce from "immer"
import { ComponentType, PropsWithChildren, useMemo, useState } from "react"
import { createContext } from "../helpers/createContext"

interface IComponentInstance {
    component: ComponentType<any>
    props: Record<string, any>
}

type WindowsContext = {
    windows: Record<string, IComponentInstance[]>
}

export const WindowsProvider = () => {
    const [windows, updateWindows] = useState<Record<string, IComponentInstance[]>>({})
    function addComponent<T extends {}>(windowName: string, component: ComponentType<T>, props: T) {
        updateWindows((value) =>
            produce(value, (draft) => {
                if (!draft[windowName]) {
                    draft[windowName] = []
                }
                draft[windowName].push({
                    component,
                    props
                })
            })
        )
    }
    return {
        windows,
        addComponent
    }
}

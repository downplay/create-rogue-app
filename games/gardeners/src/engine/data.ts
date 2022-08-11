import { isFunction } from "remeda"
import { getEntityContext } from "./entity"
import { DataRef, UpdateFunction } from "./types"

export interface DataDefinition<T> {
    name: string
}

export const defineData = <T>(name: string): DataDefinition<T> => {
    return { name }
}

const unpackDefaultValue = <T>(value: T | (() => T)) => (isFunction(value) ? value() : value)

export const hasData = <T>(
    def: DataDefinition<T>,
    defaultValue?: T | (() => T)
): [data: DataRef<T>, update: UpdateFunction<T>] => {
    const entity = getEntityContext()
    if (!(def.name in entity.localData)) {
        const data = {
            value: defaultValue ? unpackDefaultValue(defaultValue) : undefined
        }

        entity.localData[def.name] = {
            data,
            update: (dataOrUpdater: T | ((draft: T) => T)) => {
                const newValue = isFunction(dataOrUpdater)
                    ? dataOrUpdater(data.value!)
                    : dataOrUpdater
                if (data.value !== newValue) {
                    data.value = newValue
                    // TODO: How is this going to work? Need to update entities that were dependent
                    // on this data. Maybe on a path inside the data. Various options here, and maybe
                    // more than one off this list:
                    // - Fire a change action
                    // - Re-run entity definitions, pref. we know which just which ones are dependent
                    // - Do the whole thing with proxies instead of calling the update function
                    // - Force a react re-render, will need useForceUpdate and an interface into React
                }
            }
        }
    } // (dataOrUpdater: T | ((value: T) => void)) => T
    return [entity.localData[def.name].data, entity.localData[def.name].update]
}

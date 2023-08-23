import { atom } from "jotai"
import { RESET, createJSONStorage } from "jotai/utils"

export function atomWithLocalStorage<Value>(key: string, initialValue: Value) {
    const storage = createJSONStorage<Value>(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage)
    )

    function getInitialValue() {
        const value = storage.getItem(key, initialValue)
        return value
    }

    const baseAtom = atom(getInitialValue())

    const derivedAtom = atom(
        (get) => get(baseAtom),
        (get, set, update: SetStateActionWithReset<Value>) => {
            const nextValue =
                typeof update === "function"
                    ? (update as (prev: Value) => Value | typeof RESET)(get(baseAtom))
                    : update
            if (nextValue === RESET) {
                set(baseAtom, initialValue)
                return storage.removeItem(key)
            }
            set(baseAtom, nextValue)
            storage.setItem(key, nextValue)
        }
    )

    return derivedAtom
}

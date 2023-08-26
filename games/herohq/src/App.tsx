import "sanitize.css"
import { Gui } from "./gui/Gui"
import { useCallback, useEffect, useRef } from "react"
import { useAtomValue } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { actorFamily, actorIdsAtom } from "./model/actor"
import { GlobalStyles } from "./gui/GlobalStyles"

const App = () => {
    const initialized = useRef(false)
    const actorIds = useAtomValue(actorIdsAtom)

    const readActors = useAtomCallback(useCallback((get) => get(actorIdsAtom), []))

    const hydrateActor = useAtomCallback(
        useCallback((get, set, id: string) => {
            set(actorFamily(id), {
                type: "hydrate"
            })
        }, [])
    )

    useEffect(() => {
        // In strict mode in development the effect runs twice :(
        if (initialized.current) {
            // throw new Error("Effect twiced")
            return
        }
        initialized.current = true
        const ids = readActors()
        for (const id of ids) {
            hydrateActor(id)
        }
    }, [])

    return (
        <>
            <GlobalStyles />
            {initialized ? <Gui /> : null}
        </>
    )
}

export { App }

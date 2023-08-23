import "sanitize.css"
import { Gui } from "./gui/Gui"
import { useCallback, useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { actorFamily, actorIdsAtom } from "./model/actor"

const App = () => {
    const [initialized, setInitialized] = useState(false)
    const actorIds = useAtomValue(actorIdsAtom)
    console.log(actorIds)

    const readActors = useAtomCallback(useCallback((get) => get(actorIdsAtom), []))

    const hydrateActor = useAtomCallback(
        useCallback((get, set, id: string) => {
            set(actorFamily(id), {
                type: "hydrate"
            })
        }, [])
    )

    useEffect(() => {
        setTimeout(() => {
            const ids = readActors()
            console.log("IDS", ids)
            for (const id of ids) {
                console.log("hydrating", id)
                hydrateActor(id)
            }
            setInitialized(true)
        }, 1000)
    }, [])

    return <>{initialized ? <Gui /> : null}</>
}

export { App }

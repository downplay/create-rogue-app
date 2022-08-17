import { Global } from "./ui/Global"
import { Layout } from "./ui/Layout"

import "modern-css-reset/dist/reset.min.css"
import "./ui/Card.css"
import { Providers } from "./providers/Providers"
import { useEngine } from "./hooks/useEngine"
import { useRng } from "./hooks/useRng"
import { Game } from "./game/Game"
import { GlobalComponentManager } from "./with-react/ComponentManager"
import { useForceUpdate } from "./hooks/useForceUpdate"
import { TerminalGlobal } from "./game/Terminal"
import { useMemo } from "react"
import { GlobalMaterialManager } from "./with-three/MaterialManager"
import { definitions } from "./engine/entity"

const App = () => {
    const rng = useRng()
    const handleRefresh = useForceUpdate()
    const engineOptions = useMemo(() => {
        return {
            props: { rng, definitions, onRefresh: handleRefresh },
            root: { entity: Game, props: {} },
            globals: [
                { global: GlobalComponentManager, props: {} },
                { global: TerminalGlobal, props: {} },
                { global: GlobalMaterialManager, props: {} }
            ],
            debug: true
        }
    }, [handleRefresh, rng])
    const engine = useEngine(engineOptions)
    return (
        <Providers engine={engine}>
            <Global />
            <Layout />
        </Providers>
    )
}

export default App

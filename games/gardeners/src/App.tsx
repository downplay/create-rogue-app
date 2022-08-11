import { Global } from "./ui/Global"
import { Layout } from "./ui/Layout"

import "modern-css-reset/dist/reset.min.css"
import "./ui/Card.css"
import { Providers } from "./providers/Providers"
import { useEngine } from "./hooks/useEngine"
import { useRng } from "./hooks/useRng"
import { Game } from "./game/Game"
import { RatScene } from "./game/scenes/RatScene"
import { ComponentManager, GlobalComponentManager } from "./with-react/ComponentManager"
import { useForceUpdate } from "./hooks/useForceUpdate"

const definitions = [Game, RatScene, ComponentManager]

const App = () => {
    const rng = useRng()
    const handleRefresh = useForceUpdate()
    const engine = useEngine(
        { rng, definitions, onRefresh: handleRefresh },
        { entity: Game, props: {} },
        [{ global: GlobalComponentManager, props: {} }]
    )
    return (
        <Providers engine={engine}>
            <Global />
            <Layout />
        </Providers>
    )
}

export default App

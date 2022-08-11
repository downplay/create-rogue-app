import { WithEngine } from "../engine/types"
import { ControlsProvider } from "./controls"
import { EngineProvider } from "./EngineProvider"

export const Providers = ({
    children,
    engine
}: React.PropsWithChildren<{ engine: WithEngine }>) => {
    return (
        <EngineProvider value={engine}>
            <ControlsProvider>{children}</ControlsProvider>
        </EngineProvider>
    )
}

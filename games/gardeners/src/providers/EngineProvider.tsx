import { WithEngine } from "../engine/types"
import { createContext } from "../helpers/createContext"

const [useEngineContext, Provider] = createContext<WithEngine>()

export { useEngineContext, Provider as EngineProvider }

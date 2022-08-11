import { TerminalUI } from "../ui/TerminalUI"
import { hasComponent } from "../with-react/ComponentManager"

// TODO: Naming. Terminal/TerminalView or TerminalEntity/Terminal
export const Terminal = () => {
    hasComponent(TerminalUI, { slot: "terminal", props: { content: ["Testing 123"] } })
}

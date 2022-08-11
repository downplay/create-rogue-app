import { defineData, hasData } from "../engine/data"
import { defineEntity, defineGlobalInstance } from "../engine/entity"
import type { TerminalContent } from "../ui/TerminalUI"
import { TerminalUI } from "../ui/TerminalUI"
import { hasComponent } from "../with-react/ComponentManager"

const TerminalData = defineData<TerminalContent>("Terminal")

// TODO: Naming. Terminal/TerminalView or TerminalEntity/Terminal
export const Terminal = defineEntity("Terminal", () => {
    const [content, updateContent] = hasData(TerminalData, [])

    const [show, update] = hasComponent(TerminalUI, {
        slot: "terminal",
        props: { content: content.value }
    })

    return {
        write: (lines: TerminalContent) => {
            updateContent((content) => content.concat(lines))
            // TODO: Shouldn't have to manually update once we have reactive stuff
            update({ content: content.value })
        }
    }
})

export const TerminalGlobal = defineGlobalInstance(Terminal, "Terminal")

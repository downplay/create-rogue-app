import { defineAction, onAction } from "./action"
import { ExternalNodeCallback } from "@hero/text"
import { defineData, hasData } from "./data"

type ButtonAction = {
    name: string
    value?: string
}

export const BUTTON_CLICK = defineAction<ButtonAction>("BUTTON_CLICK")

export const hasStoryButton = (buttonName: string, handler?: () => void) => {
    // TODO: How to solve this mess. Seems like a REALLY complicated way to orchestrate this
    // with several moving parts outside of the herotext system. Also the way the data is defined
    // isn't ideal, we should have a map of button names at least rather than having to define
    // datas on the fly, or the hasStoryButton hook should let us create multiple buttons with different
    // names and/or values.
    const [clicked, setClicked] = hasData(defineData<boolean>("Button_" + buttonName), false)

    onAction(BUTTON_CLICK, ({ name }) => {
        if (buttonName === name) {
            setClicked(true)
            if (handler) {
                handler()
            }
        }
    })

    // TODO: Once one button from a set is clicked, all buttons must be deactivated
    const start: ExternalNodeCallback = (state, context, strand) => {
        if (!strand.internalState) {
            strand.internalState = false
        }
        if (clicked.value && !strand.internalState) {
            strand.internalState = true
        }
        if (strand.internalState === true) {
            return ""
        }
        // TODO: Not making use of the strand, we could shortcut some of the handler weirdness
        // But we'd still need a way for the Terminal to wire things back to the right instance
        // ... actually we should be including the source instance id with everything sent to terminal
        return [{ type: "ui", handler: "buttonStart", strand, name: buttonName }]
    }
    const end: ExternalNodeCallback = (state, context, strand) => {
        if (!strand.internalState) {
            strand.internalState = false
        }
        if (clicked.value && !strand.internalState) {
            strand.internalState = true
        }
        if (strand.internalState === true) {
            return ""
        }
        // TODO: Not making use of the strand, we could shortcut some of the handler weirdness
        // But we'd still need a way for the Terminal to wire things back to the right instance
        // ... actually we should be including the source instance id with everything sent to terminal
        // But for strand to work we'd have to serialize the strand (in terminal output) so every
        // strand then has an id. Doesn't really work. Or we have to regenerate terminal content
        // completely on reload. Click action works for now but it's a bit around the houses.
        context.suspend = true
        return [{ type: "ui", handler: "buttonEnd", strand, name: buttonName }]
    }
    return [start, end]
}

import { useRef, useLayoutEffect, ReactNode } from "react"
import styled from "styled-components"
import { Line } from "./Typography"
import { isString } from "remeda"
import { dispatchAction } from "../engine/action"
import { useEngine } from "../hooks/useEngine"
import { useEngineContext } from "../providers/EngineProvider"
import { EntityManager } from "../engine/entityManager"
import { BUTTON_CLICK } from "../engine/hasStoryButton"

const Scroller = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
`
type TerminalNewLine = {
    type: "newLine"
}

type TerminalButtonStart = {
    type: "buttonStart"
}

type TerminalButtonEnd = {
    type: "buttonEnd"
    instanceId: string
    name: string
    value?: string
}

type TerminalFormatPush = {
    type: "formatPush"
    color?: string
    bold?: boolean
}

type TerminalFormatPop = {
    type: "formatPop"
}

type TerminalImage = {
    type: "image"
    image: string
}

type TerminalMeta =
    | TerminalNewLine
    | TerminalButtonStart
    | TerminalButtonEnd
    | TerminalFormatPush
    | TerminalFormatPop
    | TerminalImage

type TerminalContentItem = string | TerminalMeta

export type TerminalContent = TerminalContentItem[]

type Props = {
    content: TerminalContent
}

const aggregateContent = (content: TerminalContent, entities: EntityManager) => {
    let currentLine: ReactNode[] = []
    let currentButton: ReactNode[] | undefined
    const aggregated: ReactNode[] = []
    let i = 0
    for (const item of content) {
        // TODO: There's a neater way to handle all of this and be more recursive;
        // we should have a currentElementContent array and push the different types of
        // element as needed, will help with formatting as well once we get there
        if (isString(item)) {
            if (currentButton) {
                currentButton.push(item)
            } else {
                currentLine.push(item)
            }
        } else {
            switch (item.type) {
                case "newLine":
                    if (currentButton) {
                        throw new Error("Can't create new line inside a button")
                    }
                    aggregated.push(<Line key={++i}>{currentLine}</Line>)
                    currentLine = []
                    break
                case "buttonEnd":
                    if (!currentButton) {
                        throw new Error("Tried to end a button when one hasn't been started")
                    }
                    const handler = () => {
                        const instance = entities.get(item.instanceId)
                        dispatchAction(instance, BUTTON_CLICK, { name: item.name })
                    }
                    currentLine.push(
                        <button type="button" onClick={handler}>
                            {currentButton}
                        </button>
                    )
                    currentButton = undefined
                    break
                case "buttonStart":
                    if (currentButton) {
                        throw new Error("Can't start a button inside a button")
                    }
                    currentButton = []
                    break
                default:
                    throw new Error("Not supported yet in Terminal: " + item.type)
            }
        }
    }
    if (currentLine.length) {
        aggregated.push(<Line key={++i}>{currentLine}</Line>)
    }
    return aggregated
}

export const TerminalUI = ({ content }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null!)
    const engine = useEngineContext()
    // Scroll to bottom on new message
    useLayoutEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [content])
    // TODO: Memoize content
    return <Scroller ref={scrollRef}>{aggregateContent(content, engine.entities)}</Scroller>
}

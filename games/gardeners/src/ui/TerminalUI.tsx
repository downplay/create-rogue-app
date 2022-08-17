import { useRef, useLayoutEffect } from "react"
import { ExecutionResultItem, stringifyResult } from "@hero/text"
import styled from "styled-components"
import { Line } from "./Typography"
import { isString } from "remeda"

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
    instanceId: string
    value: string
}

type TerminalButtonEnd = {
    type: "buttonEnd"
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

const aggregateContent = (content: TerminalContent) => {
    let currentLine = []
    const aggregated = []
    for (let i = 0; i < content.length; i++) {
        const item = content[i]
        if (isString(item)) {
            currentLine.push(item)
        } else {
            switch (item.type) {
                case "newLine":
                    break
                default:
                    throw new Error("Not supported yet in Terminal: " + item.type)
            }
        }
        aggregated.push(<Line key={i}>{currentLine}</Line>)
    }
    return aggregated
}

export const TerminalUI = ({ content }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null!)
    // Scroll to bottom on new message
    useLayoutEffect(() => {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [content])
    // TODO: Memoize content
    return <Scroller ref={scrollRef}>{aggregateContent(content)}</Scroller>
}

import * as nearley from "nearley"
import { Vector, isVector, RNG } from "@hero/math"
import { ExecutionContext } from "./context"
import { ExecutionResult, ExecutionResultItem, MainAST, ScopeValue } from "./types"
import grammar from "./herotext"
import { PrimitiveValue, TypedValue } from "./types"
import { stringify } from "flatted"

export const parse = (input: string): MainAST => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let parsed
    try {
        parsed = parser.feed(input.trim() + "\n")
    } catch (error) {
        console.error("Unparseable text:")
        console.error(input)
        console.error(error)
        throw new Error("Unparseable text")
    }
    const main: MainAST = parsed.results[0]
        ? (parsed.results[0] as unknown as MainAST)
        : { type: "main", content: null, labels: {} }
    if (Object.keys(main.labels).some((name) => name.startsWith("OUT"))) {
        console.error("Labels beginning with OUT are reserved for external calls:")
        console.error(input)
        console.error(parsed)
        throw new Error("Labels beginning with OUT are reserved for external calls")
    }
    return main
}

export const stringifyResult = (element: ExecutionResultItem): string => {
    if (element === null) {
        return ""
    }
    if (typeof element === "undefined") {
        return "<undefined>"
    }
    if (typeof element === "string") {
        return element
    }
    if (typeof element === "number" || typeof element === "boolean") {
        return (element as number).toString()
    }
    if (Array.isArray(element)) {
        return element.map(stringifyResult).join("")
    }
    if (isVector(element)) {
        const { x, y } = element as Vector
        return "<" + x + "," + y + ">"
    }
    if (typeof element === "object") {
        const typed = element as TypedValue
        switch (typed.type) {
            case "complex":
                return stringify(typed.value, null, "  ")
        }
    }
    return `<Error: Not stringifiable ${stringify(element, null, "  ")}>`
}

// TODO: Figure out how scope values work and start supporting non-strings
export const coalesceResult = (elements: ExecutionResultItem[]): ScopeValue => {
    const flattened: ScopeValue[] = []
    for (const element of elements) {
        if (Array.isArray(element)) {
            const sub = coalesceResult(element as ExecutionResultItem[])
            flattened.push(sub)
        } else if (
            typeof element === "string" ||
            typeof element === "number" ||
            typeof element === "boolean"
        ) {
            flattened.push(element)
        } else if (isVector(element)) {
            flattened.push(element as Vector)
        } else if (element && (element as TypedValue).type !== "input") {
            flattened.push((element as PrimitiveValue).value as ScopeValue)
        } else {
            flattened.push(stringifyResult(element))
        }
    }
    if (flattened.length === 1) {
        return flattened[0]
    }
    // Multiple results, all that really makes sense is stringifying
    // TODO: (well... maybe we actually want to return a list, if it was an array *primitive*
    return stringifyResult(elements)
}

const ParsedTextTemplateIdentifier = Symbol("ParsedTextTemplate")

export type ParsedTextTemplate = {
    main: MainAST
    render: (rng: RNG, variables?: Record<string, string>, entryPoint?: string) => string
    stream: (
        rng: RNG,
        variables?: Record<string, string>,
        executionContext?: ExecutionContext,
        entryPoint?: string
    ) => ExecutionResult
    [ParsedTextTemplateIdentifier]: true
}

export const merge = (...mains: MainAST[]) => {
    const newMain: MainAST = {
        type: "main",
        content: null,
        labels: {}
    }
    for (const main of mains) {
        if (main.content !== null) {
            newMain.content = main.content
        }
        newMain.labels = { ...newMain.labels, ...main.labels }
    }
    return newMain
}

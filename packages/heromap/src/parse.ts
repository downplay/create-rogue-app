import * as nearley from "nearley"
import grammar from "./heromap"
import { MapNode } from "./types"

export const parse = (input: string): MapNode => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
    let parsed
    try {
        parsed = parser.feed(input)
    } catch (error) {
        console.error("Unparseable text:")
        console.error(input)
        console.error(error)
        throw new Error("Unparseable text")
    }
    if (!parsed.results[0]) {
        throw new Error("Parsed empty map") // Shouldn't happen
    }
    const map: MapNode = parsed.results[0] as unknown as MapNode
    // Perform some validation?
    return map
}

let externalIndex = 0

const INLINE_EXTERNAL_TYPES = ["string", "boolean", "number"]

type Interpolation<E = any> = null | undefined | string | boolean | number | E

export const map = <E = any>(
    input: TemplateStringsArray,
    ...interpolations: Interpolation<E>[] // TODO: More strict enforcement of interp types
): MapNode => {
    const externals: Record<string, E> = {}
    const flattened = input
        .map((fragment, i) => {
            if (interpolations[i]) {
                const external = interpolations[i]
                if (external === null || typeof external === "undefined") {
                    return fragment
                }
                if (INLINE_EXTERNAL_TYPES.includes(typeof external)) {
                    // TODO: Should boolean true/false be parsed? Or convert to 1/0?
                    return fragment + external.toString()
                }
                // TODO: Maybe special handling for some Herotext / Heromap nodes
                // e.g. import maps to render sub-maps
                // TODO: Vector types for x,y placement

                // TODO: Track externals with symbol prop
                const labelName = "OUT" + externalIndex
                externalIndex++
                externals[labelName] = external as E
                return fragment + labelName
            }
            return fragment
        })
        .join("")
    try {
        const main = parse(flattened)
        return {
            ...main,
            externals
        }
    } catch (e) {
        console.error("<Error: Parser syntax error>")
        throw e
    }
}

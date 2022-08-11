import { executeText } from "../src/execute"
import { text } from "../src/text"
import { mockRng } from "./testUtils"
import { ExecutionContext } from "../src/context"

it("Streams simple string", () => {
    const rng = mockRng()
    const main = text`Quick brown fox`
    const context: ExecutionContext = { main, rng }
    expect(executeText(context)).toEqual([
        ["Quick brown fox"],
        new ExecutionContext({
            finished: true,
            suspend: false,
            error: false,
            state: {},
            rng,
            main,
            root: {
                children: [],
                localScope: {},
                path: ""
            }
        })
    ])
})

it("Accepts input", () => {
    const rng = mockRng()
    const main = text`[Input something: $input=$?]`
    const bailResult = stream(main, rng)

    const rootThreadResult = {
        children: [
            {
                children: [
                    {
                        children: [
                            {
                                children: [],
                                internalState: undefined,
                                localScope: {},
                                path: ""
                            }
                        ],
                        internalState: undefined,
                        localScope: {},
                        path: "content"
                    }
                ],
                internalState: [],
                localScope: {},
                path: 1
            }
        ],
        localScope: {},
        path: ""
    }

    expect(bailResult).toEqual([
        [
            "Input something: ",
            {
                type: "input",
                handler: undefined,
                strand: {
                    children: [],
                    localScope: {},
                    path: "",
                    internalState: undefined
                }
            }
        ],
        new ExecutionContext({
            finished: false,
            suspend: true,
            error: false,
            state: {},
            main,
            rng,
            root: rootThreadResult
        })
    ])
    ;(bailResult[0][1] as ReturnCommand).strand.internalState = "something"
    const finalResult = stream(main, rng, undefined, bailResult[1])
    rootThreadResult.children[0].children[0].children[0].internalState = "something"
    expect(finalResult).toEqual([
        ["something"],
        new ExecutionContext({
            main,
            finished: true,
            suspend: false,
            error: false,
            state: { input: "something" },
            rng,
            root: rootThreadResult
        })
    ])
})

it.skip("Awaits a promise resolution", () => {
    const rng = mockRng()
    let hoistResolve
    const promise = new Promise((resolve, reject) => {
        hoistResolve = resolve
    })
    const fixture = text`Slow ${() => promise} ...fox`
    const result1 = fixture.stream(rng)
    expect(result1).toEqual(["Slow ", { finished: false, bail: true }])
    ;(hoistResolve as unknown as (value: any) => void)("brown")
    const result2 = fixture.stream(rng, undefined, result1[1])
    expect(result2).toEqual(["brown ...fox", { finished: true, bail: false }])
})

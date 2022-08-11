import { render } from "../src/execute"
import { text } from "../src/text"
import { mockRng } from "./testUtils"

it.skip("Computes Fibonacci sequence", () => {
    const rng = mockRng()
    const fixture = text`1,1$fibonacci(<1>,<1>,<10>)

fibonacci: (iterations,a,b)
{>0},<a+b>$fibonacci(<iterations-1>,<b>,<a+b>)
    `
    expect(render(fixture, rng)).toEqual("1,1,2,3,5,8,13,21,34,55,89,144")
})

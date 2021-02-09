import { mockRng } from "../../testUtils";
import { text } from "./parse";
import { ExecutionContext } from "./ExecutionContext";

it("Streams simple string", () => {
  const rng = mockRng();
  expect(text`Quick brown fox`.stream(rng)).toEqual([
    "Quick brown fox",
    new ExecutionContext({
      finished: true,
      bail: false,
      currentNodePath: [],
      error: false,
      state: {},
    }),
  ]);
});

it.skip("Awaits a promise resolution", () => {
  const rng = mockRng();
  let hoistResolve;
  const promise = new Promise((resolve, reject) => {
    hoistResolve = resolve;
  });
  const fixture = text`Slow ${() => promise} ...fox`;
  const result1 = fixture.stream(rng);
  expect(result1).toEqual(["Slow ", { finished: false, bail: true }]);
  ((hoistResolve as unknown) as (value: any) => void)("brown");
  const result2 = fixture.stream(rng, undefined, undefined, result1[1]);
  expect(result2).toEqual(["brown ...fox", { finished: true, bail: false }]);
});

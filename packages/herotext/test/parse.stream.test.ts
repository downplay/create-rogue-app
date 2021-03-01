import { text, stream, ReturnCommand, ExecutionContext } from "../index";
import { mockRng } from "./testUtils";

it("Streams simple string", () => {
  const rng = mockRng();
  const main = text`Quick brown fox`;
  expect(stream(main, rng)).toEqual([
    ["Quick brown fox"],
    new ExecutionContext({
      finished: true,
      suspend: false,
      error: false,
      state: {},
      main,
    }),
  ]);
});

it.skip("Accepts input", () => {
  const rng = mockRng();
  const main = text`Input something\: $input=$?`;
  const bailResult = stream(main, rng);
  expect(bailResult).toEqual([
    [
      "Input something: ",
      {
        type: "input",
        execution: {
          path: ["1", "0"],
        },
      },
    ],
    new ExecutionContext({
      finished: false,
      suspend: true,
      error: false,
      state: {},
      main,
    }),
  ]);
  (bailResult[0][1] as ReturnCommand).execution.yieldValue = "something";
  const finalResult = fixture.stream(rng, undefined, bailResult[1]);
  expect(finalResult).toEqual([
    ["something"],
    new ExecutionContext({
      finished: true,
      bail: false,
      error: false,
      state: { input: "something" },
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
  const result2 = fixture.stream(rng, undefined, result1[1]);
  expect(result2).toEqual(["brown ...fox", { finished: true, bail: false }]);
});

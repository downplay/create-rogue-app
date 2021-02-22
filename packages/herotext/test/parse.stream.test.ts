import { text, ReturnCommand, ExecutionContext } from "../index";
import { mockRng } from "./testUtils";

it("Streams simple string", () => {
  const rng = mockRng();
  expect(text`Quick brown fox`.stream(rng)).toEqual([
    "Quick brown fox",
    new ExecutionContext({
      finished: true,
      bail: false,
      error: false,
      state: {},
      executions: [],
    }),
  ]);
});

it("Accepts input", () => {
  const rng = mockRng();
  const fixture = text`Input something: $input=$<IN`;
  const bailResult = fixture.stream(rng);
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
      bail: true,
      error: false,
      state: {},
      executions: [
        {
          path: ["1", "0"],
        },
      ],
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

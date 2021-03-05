import { map } from "../src/parse";
import { build } from "../src/build";
import { mockRng } from "../../herotext/test/testUtils";
it("builds a map", () => {
  const fixture = map`
    .

    . = #
`;
  // console.log(JSON.stringify(fixture, null, "  "));
  expect(build(fixture)).toMatchSnapshot();
});

it("applies elements to cells", () => {
  const fixture = map`
    .#

    . = Floor
    # = Wall
`;
  expect(build(fixture)).toMatchSnapshot();
});

it("applies multiple elements to cells", () => {
  const fixture = map`
    .

    . = Floor + Rat
`;
  expect(build(fixture)).toMatchSnapshot();
});

it("applies probability-based brushes to cells", () => {
  const rng = mockRng([0.1, 0.3, 0.5, 0.7, 0.9]);
  const rngSpy = jest.spyOn(rng, "pick");
  const fixture = map`
    .....

    . = Rat:20% | Floor:2/5 | Wall
`;
  expect(build(fixture, rng)).toMatchSnapshot();
  expect(rngSpy).toHaveBeenCalledTimes(5);
});

it("applies nothing on remaining fraction", () => {
  const rng = mockRng([0.25, 0.75]);
  const fixture = map`
    ....

    . = Wall:50%
`;
  expect(build(fixture, rng)).toMatchSnapshot();
});

import { executeText, text } from "./parse";
import { mockRng } from "../../testUtils";

it("Renders simple string", () => {
  const rng = mockRng();
  expect(text`Quick brown fox`.render(rng)).toEqual("Quick brown fox");
});

it("Renders random choices", () => {
  const rng = mockRng();
  const parsed = text`(Quick|Slow) (brown|blue|paisley) (fox|rabbit|dog|cat|mouse)`;
  expect(parsed.render(rng)).toEqual("Quick blue cat");
  expect(parsed.render(rng)).toEqual("Quick brown dog");
  expect(parsed.render(rng)).toEqual("Slow brown rabbit");
});

it("Picks from list", () => {
  const rng = mockRng([0.5, 0.8]);
  const parsed = text`
foo
bar
baz
  `;
  expect(parsed.render(rng)).toEqual("bar");
  expect(parsed.render(rng)).toEqual("baz");
});

it("Substitutes labels", () => {
  const rng = mockRng();
  const parsed = text`Foo $bar

bar:
Baz
Barry`;
  expect(parsed.render(rng)).toEqual("Foo Baz");
});

it("Assigns variables", () => {
  const rng = mockRng([0.75]);
  // const parsed = text`The ($animal=cat|dog) was a good $animal`;
  const parsed = text`The ($animal=cat|dog) was a good $animal`;
  expect(parsed.render(rng, { animal: "" })).toEqual("The dog was a good dog");
});

import { executeText, text } from "./parse";
import { mockRng } from "../../testUtils";

it("Renders simple string", () => {
  const rng = mockRng();
  expect(text`Quick brown fox`.render(rng)).toEqual("Quick brown fox");
  expect(text`(Quick brown fox)`.render(rng)).toEqual("Quick brown fox");
  expect(
    text`(Quick
brown
fox)`.render(rng)
  ).toEqual("Quick\nbrown\nfox");
});

it("Renders simple choices", () => {
  const rng = mockRng([0.75, 0.25]);
  let parsed = text`You win|You lose`;
  expect(parsed.render(rng)).toEqual("You lose");
  expect(parsed.render(rng)).toEqual("You win");
  parsed = text`
(Group
multi|choice
list)
(Second
multi|line
list)
`;
  expect(parsed.render(rng)).toEqual("Second\nmulti");
  rng.raw();
  expect(parsed.render(rng)).toEqual("choice\nlist");
});

it("Renders grouped choices", () => {
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
  expect(
    text`The $animal=dog was a good $animal`.render(rng, { animal: "" })
  ).toEqual("The dog was a good dog");
  expect(
    text`The ($animal=dog) was a good $animal`.render(rng, { animal: "" })
  ).toEqual("The dog was a good dog");
});

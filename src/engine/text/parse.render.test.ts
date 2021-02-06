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
  expect(text`Quick (brown) fox`.render(rng)).toEqual("Quick brown fox");
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
  const rng = mockRng([0.5, 0.67, 0.6, 0, 0, 0, 0.9, 0.5, 0.39]);
  const parsed = text`(Quick|Slow) (brown|blue|paisley) (fox|rabbit|dog|cat|mouse)`;
  expect(parsed.render(rng)).toEqual("Slow paisley cat");
  expect(parsed.render(rng)).toEqual("Quick brown fox");
  expect(parsed.render(rng)).toEqual("Slow blue rabbit");
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

it("Renders labels", () => {
  const rng = mockRng();
  const parsed = text`
one:
foo

two:
bar
`;
  expect(parsed.render(rng, undefined, undefined, "one")).toEqual("foo");
  expect(parsed.render(rng, undefined, undefined, "two")).toEqual("bar");
});

it("Substitutes labels", () => {
  const rng = mockRng();
  let parsed = text`Foo $bar

bar:
Baz
Barry`;
  expect(parsed.render(rng)).toEqual("Foo Baz");
  parsed = text`Foo $(foo bar)

foo bar:
Baz
Barry`;
  expect(parsed.render(rng)).toEqual("Foo Baz");
});

it("Performs label substitution", () => {
  const rng = mockRng();
  expect(
    text`Hello $planet
  
planet:
world`.render(rng)
  ).toEqual("Hello world");
});

it("Merges labels from other templates", () => {
  const rng = mockRng();
  const baseLabels = text`
test:
this is a test
`;
  const mainText = text`$test

${baseLabels}`;

  expect(mainText.render(rng)).toEqual("this is a test");

  const overrideLabels = text`
test:
this is another test
`;
  expect(text`$test${baseLabels}${overrideLabels}`.render(rng)).toEqual(
    "this is another test"
  );

  const overrideText = text`$test

${baseLabels}

test:
the final test`;
  expect(overrideText.render(rng)).toEqual("the final test");
});

it("Assigns variables", () => {
  const rng = mockRng([0.75, 0.25]);
  // TODO: Test context from stream contains variable
  expect(
    text`The $animal=dog was a good $animal`.render(rng, { animal: "" })
  ).toEqual("The dog was a good dog");
  expect(
    text`The $animal=kitty|mouse|badger was a bad $animal`.render(rng)
  ).toEqual("The badger was a bad badger");
  expect(
    text`The $animal=(naughty kitty|tiny mouse|bad badger) was a very $animal`.render(
      rng
    )
  ).toEqual("The naughty kitty was a very naughty kitty");
  expect(
    text`See $(animal name)=Spot|Cosmonaught|Shablongy run. Run $(animal name) run.`.render(
      rng
    )
  ).toEqual("See Shablongy run. Run Shablongy run.");
});

it("Interpolates external variables", () => {
  const rng = mockRng();
  const color = "brown";
  expect(text`Quick ${color} fox`.render(rng)).toEqual("Quick brown fox");
  const answer = 42;
  expect(text`The answer is ${answer}`.render(rng)).toEqual("The answer is 42");
});

it("Calls internal functions", () => {
  const rng = mockRng();
  expect(
    text`
$repeat(NaN,asdasd,asdasd) Batman!

repeat: (word, count)
$word$word$word$word$word$word$word$word
`.render(rng)
  ).toEqual("NaNNaNNaNNaNNaNNaNNaNNaN Batman!");
});

type FooProps = {
  foo: string;
};

it("Calls external functions", () => {
  const rng = mockRng();
  const capitalize = (text: string) => text.toLocaleUpperCase();
  expect(
    text`$foo=bar ${({ foo }: FooProps) => capitalize(foo)} black sheep`.render(
      rng
    )
  ).toEqual("bar BAR black sheep");
});

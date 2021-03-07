import { text, render } from "../index";
import { mockRng } from "./testUtils";

it("Renders simple string", () => {
  const rng = mockRng();
  expect(render(text`Quick brown fox`, rng)).toEqual("Quick brown fox");
  expect(render(text`[Quick brown fox]`, rng)).toEqual("Quick brown fox");
  expect(
    render(
      text`[Quick
brown
fox]`,
      rng
    )
  ).toEqual("Quick\nbrown\nfox");
  expect(render(text`Quick [brown] fox`, rng)).toEqual("Quick brown fox");
});

it.skip("Renders blank lines", () => {
  const rng = mockRng();
  expect(render(text``, rng)).toEqual("");
  expect(render(text`{}`, rng)).toEqual("");
  expect(
    render(
      text`$blank
  
  blank:
  []`,
      rng
    )
  ).toEqual("");
});

it("Renders simple choices", () => {
  const rng = mockRng([0.75, 0.25]);
  let parsed = text`[You win|You lose]`;
  // TODO: figure out nospace word choices? (no preconds)
  // let parsed = text`You win|lose`;
  expect(render(parsed, rng)).toEqual("You lose");
  expect(render(parsed, rng)).toEqual("You win");
  parsed = text`
[Group
multi|choice
list]
[Second
multi|line
list]
`;
  expect(render(parsed, rng)).toEqual("Second\nmulti");
  rng.raw();
  expect(render(parsed, rng)).toEqual("choice\nlist");
});

it("Renders grouped choices", () => {
  const rng = mockRng([0.5, 0.67, 0.6, 0, 0, 0, 0.9, 0.5, 0.39]);
  const parsed = text`[Quick|Slow] [brown|blue|paisley] [fox|rabbit|dog|cat|mouse]`;
  expect(render(parsed, rng)).toEqual("Slow paisley cat");
  expect(render(parsed, rng)).toEqual("Quick brown fox");
  expect(render(parsed, rng)).toEqual("Slow blue rabbit");
});

it("Picks from list", () => {
  const rng = mockRng([0.5, 0.8]);
  const parsed = text`
foo
bar
baz
  `;
  expect(render(parsed, rng)).toEqual("bar");
  expect(render(parsed, rng)).toEqual("baz");
});

it("Renders labels", () => {
  const rng = mockRng();
  const parsed = text`
one:
foo

two:
bar
`;
  expect(render(parsed, rng, undefined, "one")).toEqual("foo");
  expect(render(parsed, rng, undefined, "two")).toEqual("bar");
});

it("Substitutes labels", () => {
  const rng = mockRng();
  let parsed = text`Foo $bar

bar:
Baz
Barry`;
  expect(render(parsed, rng)).toEqual("Foo Baz");
  parsed = text`Foo $[foo bar]

foo bar:
Baz
Barry`;
  expect(render(parsed, rng)).toEqual("Foo Baz");
});

it("Performs label substitution", () => {
  const rng = mockRng();
  expect(
    render(
      text`Hello $planet
  
planet:
world`,
      rng
    )
  ).toEqual("Hello world");
});

// TODO: Should be in a separate parse.merge.test.ts ?
// (Also test labels merging together instead of overriding)
it("Merges labels from other templates", () => {
  const rng = mockRng();
  const baseLabels = text`
test:
this is a test
`;
  const mainText = text`$test

${baseLabels}`;

  expect(render(mainText, rng)).toEqual("this is a test");

  const overrideLabels = text`
test:
this is another test
`;
  expect(render(text`$test${baseLabels}${overrideLabels}`, rng)).toEqual(
    "this is another test"
  );

  const overrideText = text`$test

${baseLabels}

test:
the final test`;
  expect(render(overrideText, rng)).toEqual("the final test");
});

it("Assigns variables", () => {
  const rng = mockRng([0.75, 0.25]);
  // TODO: Test context from stream contains variable
  expect(
    render(text`The $animal=dog was a good $animal`, rng, { animal: "" })
  ).toEqual("The dog was a good dog");
  expect(
    render(text`The $animal=kitty|mouse|badger was a bad $animal`, rng)
  ).toEqual("The badger was a bad badger");
  expect(
    render(
      text`The $animal=[naughty kitty|tiny mouse|bad badger] was a very $animal`,
      rng
    )
  ).toEqual("The naughty kitty was a very naughty kitty");
  expect(
    render(
      text`See $[animal name]=Spot|Cosmonaught|Shablongy run. Run $[animal name] run.`,
      rng
    )
  ).toEqual("See Shablongy run. Run Shablongy run.");
});

it("Assigns variables with label syntax", () => {
  const rng = mockRng([0.25, 0.75]);
  expect(
    render(
      text`Call a $tool a $tool

tool:=
spade
hammer`,
      rng
    )
  ).toEqual("Call a spade a spade");
});

it("Executes all with + and ~ labels", () => {
  const rng = mockRng([0.25, 0.75]);
  // TODO: implement ~ label
  const fixture = text`$countdown

countdown:+
3...
2...
1...`;
  expect(render(fixture, rng)).toEqual("3...2...1...");
});

it("Honours preconditions", () => {
  const rng = mockRng([0, 0.18, 0.2, 0.99]);
  // Basic weightings
  const fixture = text`$demo

demo:
{20%}Only 20% chance
{80%}More likely
{10%}Doesn't actually have to add up to 100...
`;
  expect(render(fixture, rng)).toEqual("Only 20% chance");
  expect(render(fixture, rng)).toEqual("Only 20% chance");
  expect(render(fixture, rng)).toEqual("More likely");
  expect(render(fixture, rng)).toEqual(
    "Doesn't actually have to add up to 100..."
  );
});

it("Performs substitution inside label names", () => {
  const rng = mockRng([0.25, 0.75, 0.75, 0.25]);

  const fixture = text`The $animal goes $[[$animal]Noise]

animal:=
cat
dog

catNoise:
meow
purr

dogNoise:
woof
bark`;

  expect(render(fixture, rng)).toEqual("The cat goes purr");
  expect(render(fixture, rng)).toEqual("The dog goes woof");
});

it("Interpolates external variables", () => {
  const rng = mockRng();
  const color = "brown";
  expect(render(text`Quick ${color} fox`, rng)).toEqual("Quick brown fox");
  const answer = 42;
  expect(render(text`The answer is ${answer}`, rng)).toEqual(
    "The answer is 42"
  );
});

// type RepeatProps = {
//   count: number;
// };

it("Calls label functions", () => {
  const rng = mockRng();
  expect(
    render(
      text`
$repeat(NaN) Batman!

repeat: ($word)
$word$word$word$word$word$word$word$word
`,
      rng
    )
  ).toEqual("NaNNaNNaNNaNNaNNaNNaNNaN Batman!");

  // TODO: Almost...
  //   expect(
  //     text`
  // $repeat(NaN,<8>) Batman!

  // repeat: (word,count)
  // {count>0}$word$repeat($word,<${({ count }: RepeatProps) => count - 1}>)
  // `.render(rng)
  //   ).toEqual("NaNNaNNaNNaNNaNNaNNaNNaN Batman!");
});

type FooProps = {
  foo: string;
};

it("Calls external functions", () => {
  const rng = mockRng();
  const capitalize = (text: string) => text.toLocaleUpperCase();
  expect(
    render(
      text`[$foo=bar] ${({ foo }: FooProps) => capitalize(foo)} black sheep`,
      rng
    )
  ).toEqual("bar BAR black sheep");
});

it("Executes child AST trees", () => {
  const rng = mockRng([0.25, 0.75]);
  const child = text`[man|$animal]

animal:
mouse
chicken
`;
  const main = text`Are you ${child} or ${child}?`;
  console.log(JSON.stringify(main, null, "  "));
  expect(render(main, rng)).toEqual("Are you man or mouse?");
});

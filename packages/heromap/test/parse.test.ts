import { map } from "../src/parse";

it("parses a map", () => {
  const parsed = map`
    ####
    #..#
    ####

    Foo  = Bar
    a    = Baz
    [bc] = [ab]
    b    = Sheep | Cow:30% + Rat:2 | (Bat + Cat):2/3
    
    ( a = b ) | ( Cow = Rat )
    `;

  expect(parsed).toMatchSnapshot();
});

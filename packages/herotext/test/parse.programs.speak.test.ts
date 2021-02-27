import { text, commonFunctions } from "../index";
import { mockRng } from "./testUtils";

it.skip("Counts up to 9999", () => {
  const rng = mockRng();
  const fixture = text`[$speak->234,
$speak->999,
$speak->1,
$speak->12,
$speak->112]
  
${commonFunctions}

speak: ($number)
[0]nought
[1]one
[2]two
[3]three
[4]four
[5]five
[6]six
[7]seven
[8]eight
[9]nine
[10]ten
[11]eleven
[12]twelve
[13]thirteen
[15]fifteen
[<20]$speak->$slice($number,1)teen
[20]twenty
[30]thirty
[40]fourty
[50]fifty
[60]sixty
[70]seventy
[80]eighty
[90]ninety
[<100]$speak->($slice($number,0,1)0)-$speak->$slice($number,1)
[<1000]$speak->($slice($number,0,1)0) hundred$and->$slice($number,1)
[1000]one thousand

umpteen: ($number)
($number)teen

and: ($number)
[=00]
[0] and $speak->$number
`;

  expect(fixture.render(rng)).toEqual(`one
two
three`);
});

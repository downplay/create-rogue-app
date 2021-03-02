import { text, commonFunctions } from "../index";
import { mockRng } from "./testUtils";
import { render } from "../src/execute";

// TODO: Early version was simpler, like this:
// {<20}$speak($slice($number,1))teen
// {<100}$speak($slice($number,0,1)0)-$speak($slice($number,1))
// {<1000}$speak($slice($number,0,1)0) hundred$and($slice($number,1))
//
// Would be nice to support "first match" (maybe label:. ) so the additional
// preconditions aren't required, additionally need both AND and OR somehow
//
// And finally it'd be good to automatically convert these to numbers
// ($number,0,0)
// Either by defining it on the $slice signature, or by using <0>

// TODO: Also, really think about how these are treated as numbers, strings, weights.
// Would be nice to express {00} to only match the 00 string. Maybe some way of things
// being "string and number" until they're used. Or should we do like:
// {<12>} for a number, {10} for a weight, {[12]} for a string ... hrm ...
// should % still do anything?

it("Counts up to 9999", () => {
  const rng = mockRng();
  const fixture = text`
[$speak(1)
$speak(12)
$speak(17)
$speak(34)
$speak(112)
$speak(285)
$speak(300)
$speak(516)
$speak(999)
$speak(1000)]

${commonFunctions}

speak: ($number)
{0}nought
{1}one
{2}two
{3}three
{4}four
{5}five
{6}six
{7}seven
{8}eight
{9}nine
{10}ten
{11}eleven
{12}twelve
{13}thirteen
{14}$umpteen($slice($number,1))
{15}fifteen
{>15,<20}$umpteen($slice($number,1))
{20}twenty
{30}thirty
{40}fourty
{50}fifty
{60}sixty
{70}seventy
{80}eighty
{90}ninety
{>20,<100,$slice($number,1)!=0}$speak($slice($number,0,1)0)-$speak($slice($number,1))
{>=100,<1000}$speak($slice($number,0,1)) hundred$and($slice($number,1))
{1000}one thousand

umpteen: ($number)
$speak($number)teen

and: ($number)
{0}
{0%} and $speak($number)
`;

  expect(render(fixture, rng)).toEqual(`one
twelve
seventeen
thirty-four
one hundred and twelve
two hundred and eighty-five
three hundred
five hundred and sixteen
nine hundred and ninety-nine
one thousand`);
});

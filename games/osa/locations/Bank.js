import { text } from "../../../src/engine/text/parse";
import { goTo } from "../commands/goTo";
import { HighStreetMid } from "./HighStreetMid";

export const BankTeller = text`
Setup:+
[$queue=10]

Description:
A souless Gonzo employee. There is nothing memorable about them whatsoever, other than their sheer lack of humanity.

TALK:
{$[bank queue]>0}[I'm sorry $PlayerFormalTitle, you must wait at the back of the queue.[{$jumpedBefore}
If you persist in trying to jump the queue, I shall have to inform security.]$jumpedBefore=1] 
{0%}How may Gonzo help you today $PlayerFormalTitle?$DialogTree

PlayerFormalTitle:
{$player=Biscuits}...er, kitty...
{$player=Derek}Sir
{$player=Gilly}Ma'am

DialogTree:+
-> Withdraw money
-> Deposit money
-> Take out a loan
`;

export const Bank = text`[You are about half-way up the High St. To the East is the pie shop.
To the West is the bank. The street runs North and South.]
{0}The middle of the High St.

LongDescription:
[Once upon a time, this building was the local pub. Now it is decored in the gaudy plastic branding of Gonzo Bank Unlimited.
Some of the original architecture prevails, but where the bar once stood, now there is a series of bulletproof glass 
teller enclosures. Only one of them is manned, by a smartly-dressed but entirely forgettable emlpoyee.

ShortDescription:

GO WEST:
A staff door with a numeric keypad lock is blocking your way.

GO EAST:
${goTo(HighStreetMid)}
`;

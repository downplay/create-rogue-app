import { text } from "herotext";

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

export const Bank = text`
LongDescription:
[Once upon a time, this building was a fine local pub. Now it is decored in the gaudy plastic branding of Gonzo Bank Unlimited.
Some of the original architecture prevails, but where the bar once stood, now there is a series of bulletproof glass 
teller enclosures. Only one of them is manned, by a smartly-dressed but otherwise entirely forgettable employee.]

ShortDescription:
A carbon-copy Gonzo branch.

GO WEST:
A staff door with a numeric keypad lock is blocking your way.

GO EAST:
$goto(HighStreetMid)
`;

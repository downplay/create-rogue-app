import { text } from "herotext";
import { goTo } from "./commands/goTo";
import { Alley } from "./locations/Alley";

const Derek = "Derek";
const Biscuits = "Biscuits";
const Gilly = "Gilly";

export const intro = text`[
O.S.A.: OLD SCHOOL ADVENTURE
============================

(C)2021 Petahertz Studio

Hero Text engine by P. Hurst

Choose your character! $ChooseCharacter
]

ChooseCharacter:
[
1. Derek, the Mild Mannered Office Worker
2. Gilly "the Grass Snake", a Rogue and a Wanderer
3. Biscuits, a Street Cat
$choice=$?
$BeginGame
]

BeginGame:
{$choice=1}$player=${Derek}${goTo(Bedroom)}
{$choice=2}$player=${Gilly}${goTo(Bar)}
{$choice=3}$player=${Biscuits}${goTo(Alley)}
{0%}
`;

// $<OPTION([1. Derek, the Mild Mannered Office Worker],[$player=${Derek}]${(
//   _,
//   { engine }
// ) => engine.go(bedroom)})
// $OPTION([2. Gilly the Snake, a Rogue and a Wanderer],[$player=$<${Sally}]${(
//   _,
//   { engine }
// ) => engine.go(bar)})
// $<OPTION([3. Biscuits, a ``Street Cat],[$player=$<${Biscuits}]${(
//   _,
//   { engine }
// ) => engine.go(alley)})
// Whom will you be?$<OPTIONS
// `;

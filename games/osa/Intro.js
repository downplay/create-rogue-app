import { text, merge } from "herotext";
import { baseCommands } from "./commands/baseCommands";

const Derek = "Derek";
const Biscuits = "Biscuits";
const Gilly = "Gilly";

export const Intro = merge(
  baseCommands,
  text`[
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
{$choice=1}[$player=${Derek}]$goto(Bedroom)
{$choice=2}[$player=${Gilly}]$goto(Bar)
{$choice=3}[$player=${Biscuits}]$goto(Alley)
{0%}Invalid choice, please pick again...$ChooseCharacter
`
);
console.log(JSON.stringify(Intro, null, "  "));
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

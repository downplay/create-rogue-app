import { text } from "@hero/text";
import { stats, hasStats } from "../../../mechanics/hasStats";
import { entity } from "../../../engine/entity";
import { Factions, hasFaction } from "../../behaviours/hasFaction";
import { hasRandomMovement } from "../../behaviours/hasRandomMovement";
import { triGendered } from "../../behaviours/triGendered";
const peopleTiles = text`
{$gender=neutral}[👱|👱🏻|👱🏼|👱🏽|👱🏾|👱🏿|🧓|🧓🏻|🧓🏼|🧓🏽|🧓🏾|🧓🏿|🧑|🧑🏻|🧑🏼|🧑🏽|🧑🏾|🧑🏿]
{$gender=male}[👴|👴🏻|👴🏼|👴🏽|👴🏾|👴🏿|👨‍🦳|👨🏻‍🦳|👨🏼‍🦳|👨🏽‍🦳|👨🏾‍🦳|👨🏿‍🦳|👱‍♂️|👱🏻‍♂️|👱🏼‍♂️|👱🏽‍♂️|👱🏾‍♂️|👱🏿‍♂️|🧔|🧔🏻|🧔🏼|🧔🏽|🧔🏾|🧔🏿|👨|👨🏻|👨🏼|👨🏽|👨🏾|👨🏿|👨‍🦱|👨🏻‍🦱|👨🏼‍🦱|👨🏽‍🦱|👨🏾‍🦱|👨🏿‍🦱|👨‍🦰|👨🏻‍🦰|👨🏼‍🦰|👨🏽‍🦰|👨🏾‍🦰|👨🏿‍🦰]
{$gender=female}[👱‍♀️|👱🏻‍♀️|👱🏼‍♀️|👱🏽‍♀️|👱🏾‍♀️|👱🏿‍♀️|👩|👩🏻|👩🏼|👩🏽|👩🏾|👩🏿|👵|👵🏻|👵🏼|👵🏽|👵🏾|👵🏿|👩‍🦱|👩🏻‍🦱|👩🏼‍🦱|👩🏽‍🦱|👩🏾‍🦱|👩🏿‍🦱|👩‍🦰|👩🏻‍🦰|👩🏼‍🦰|👩🏽‍🦰|👩🏾‍🦰|👩🏿‍🦰|👩‍🦳|👩🏻‍🦳|👩🏼‍🦳|👩🏽‍🦳|👩🏾‍🦳|👩🏿‍🦳]
`;

// const PatronTile = () => (
//   <>
//     <Emoji>😁</Emoji>
//     <Emoji>🍺</Emoji>
//   </>
// );

const patronStats = stats(20, 10, 4);

// ${ hasInventory(({rng:RNG}) => ({gold:rng.dice(2,6), items:[{type:Beer, wield:true}]})
// $hasInventory(gold:<2d6>, items: <$Beer(wield)>)
export const Patron = entity(text`
${hasStats(patronStats)}

// TODO: Switch between movements depending on faction
${hasRandomMovement}
${hasFaction(Factions.Player)}
${triGendered}

Type:
Patron

Name:
Beer-swilling patron

Tile:=
${peopleTiles}

Describe:
[This inebriate reeks of stale beer and has a distinctly
unwashed look about them.

$DescribeFaction]

DescribeFaction:
{$faction!=Player}They are not looking too friendly.
{$faction==Player}They are stumbling around happily.

onTurn:
{5%}$Banter
{}

Banter:
Oi oi!
What ho!
Howdy
¡Hola!
Pardon...
Cheers!
`);

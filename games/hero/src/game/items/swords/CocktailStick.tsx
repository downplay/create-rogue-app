import { text } from "herotext";
import { OnHitState, Sword } from "../Sword";

export const CocktailStick = text`
${Sword}

Describe:
[Stick 'em with the pointy end. Or the other end, they're both the same. The tiniest wooden sword you've ever seen;
you might just pick your teeth with it.

Grants +2 critical multiplier.]

Tile:
/

material:
wood

size:
0.1

Type:
CocktailStick

Name:
The Cocktail Stick

onHit:~ ($actor,$target,$hit)
${({ hit }: OnHitState) => (hit.criticalMultiplier += 2)}
`;

import React, { useEffect, useMemo } from "react";
import { useTerminal } from "../../engine/terminal";
import { useRng } from "../../engine/useRng";
import { GrassLand } from "../biomes/plains/GrassLand";
import { Road } from "../biomes/plains/Road";

export const TavernEncounter = () => {
  const terminal = useTerminal();
  const rng = useRng();
  // useRandomFactor(s) ?
  const tavernName = useMemo(
    () => rng.text`
$YeOldePubbe
$DuckAndWaffle
$KingsArms

YeOldePubbe:
$ye $adjective $pub

DuckAndWaffle:
$ye $sillyThing $and $sillyThing

KingsArms:
$ye $importantPerson's $limb

ye:
Ye
The

adjective:
Olde
Anschiente
Magick
Crumbly
Thingie
Broken
Unfortunate
Lonely

pub:
Pubbe
Drink-hole
Tavern
House
Shack
Hovel

and:
And
&
+

sillyThing:
Dog
Bone
Ladder
Snake
Spade
Fork
Duck
Waffle
Biscuit
Bells
Grommit
Banker
Sparrow
Shine
Sun
Stars
Moon

importantPerson:
King
Queen
Ace
Lord

limb:
Arm$s
Leg$s
Head$s
Hand$s
Knee$s
(Feet|Foot)

s:
s
!
`,
    []
  );

  useEffect(() => {
    terminal.write(
      `You see a rustic-looking tavern. A creaking sign hanging by the door and swinging gently in the breeze reads: "${tavernName}"`
    );
  }, []);

  return (
    <>
      <GrassLand />
      <Road />
    </>
  );
};

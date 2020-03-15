import React, { useEffect, useMemo } from "react";
import { useTerminal } from "../../engine/terminal";
import { useRng } from "../../engine/useRng";

export const TavernEncounter = () => {
  const terminal = useTerminal();
  const rng = useRng();
  // useRandomFactor(s) ?
  const tavernName = useMemo(() => {
    rng.text`
($YeOldePubbe|$DuckAndWaffle|$KingsArms)

YeOldePubbe:
(Ye|The) $adjective $pubNoun

DuckAndWaffle:
(Ye|The|) $sillyThing $and $sillyThing

KingsArms:
(Ye|The|) $importantPerson's

and:
And
&
+

sillyThing:
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
Moon*
`;
  });

  useEffect(() => {
    terminal.write(
      "You see a rustic-looking tavern. A creaking sign hanging by the door reads " +
        tavernName +
        "."
    );
  }, []);

  return (
    <>
      <GrassLand />
      <Road />
    </>
  );
};

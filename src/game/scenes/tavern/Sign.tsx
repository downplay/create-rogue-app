import React, { useMemo } from "react";
import { useRng } from "../../../engine/useRng";
import { text } from "../../../engine/text/parse";
import { onInteract } from "../../../engine/canInteractWith";
import { hasTile } from "../../../engine/hasTile";
import { Emoji } from "../../../ui/Typography";
import { Scenery } from "../../meta/Scenery";
import { Card, Description } from "../../../ui/Card";
import { Name } from "../../meta/Name";
import { PositionProps, hasPosition } from "../../../engine/hasPosition";
import { useTerminal } from "../../../engine/terminal";
import { useText } from "../../../engine/useText";

type SignProps = PositionProps & {
  tavernName: string;
};

const SignTile = () => <Emoji>🚧</Emoji>;

/**
 * Tavern sign: should probably be repurposed as a general sign with a prop for text
 */
export const Sign = ({ tavernName, position }: SignProps) => {
  hasPosition(position);
  hasTile(SignTile);
  const terminal = useTerminal();
  const signText = useText(
    text`
(*$tavernName* welcomes
careful drunks)
(Menu
- Beer
- Beer
- Beer!)
(😁 Happy Hour!
All day long!!)
`,
    { tavernName }
  );
  onInteract(() => {
    terminal.write("The sign reads:");
    terminal.write(signText);
  });
  return (
    <Scenery>
      <Card>
        <Name>{`A sign`}</Name>
        <Description>
          <SignTile /> "{tavernName}".
          <br />
          Something else is written on it, but you can't make it out from here.
        </Description>
      </Card>
    </Scenery>
  );
};

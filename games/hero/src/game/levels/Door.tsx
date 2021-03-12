import React from "react";
import { text, ContentAST } from "herotext";
import { Emoji } from "../../ui/Typography";
import { hasPosition, PositionState } from "../../mechanics/hasPosition";
import { hasTile, TileState } from "../../mechanics/hasTile";
import { entity } from "../../engine/entity";
import { canInteractWith } from "../../mechanics/canInteractWith";

export const DoorTile = () => <Emoji>🚪</Emoji>;

export type DoorState = PositionState &
  TileState & {
    // TODO: Not 100% sure how this will work, is it events or callbacks?
    onEnter: ContentAST;
  };

// TODO: Want two slightly different kinds of doors. Plain open/close ones a la DC:SS,
// then one like this with an event to go to different locations

export const Door = entity(text<DoorState>`
${hasTile(DoorTile)}
${hasPosition()}
${canInteractWith}

onEnter:~
You walk through the door...

onInteract:~
$onEnter
`);

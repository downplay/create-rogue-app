import React from "react";
import { Emoji } from "../../../ui/Typography";
import { hasRandomMovement } from "../../behaviours/hasRandomMovement";
import { hasTile } from "../../../engine/hasTile";
import { stats, hasStats } from "../../../engine/hasStats";
import { Monster } from "../../meta/Monster";
import { Card, Description } from "../../../ui/Card";
import { Name } from "../../meta/Name";
import { patronBanter } from "./text";
import { onTurn } from "../../../engine/game";
import { useRng } from "../../../engine/useRng";
import { useTerminal } from "../../../engine/terminal";
import { GridLayers } from "../../../engine/grid";
import { useEntityState } from "../../../engine/useEntityState";
import { hasFaction, Factions } from "../../behaviours/hasFaction";
import { text } from "../../../engine/text/parse";

enum BarkeepPose {
  Normal,
  Sweating,
}

type BarkeepTileProps = {
  pose?: BarkeepPose;
};

const barkeepFaces = {
  [BarkeepPose.Normal]: "😃",
  [BarkeepPose.Sweating]: "😅",
};

const BarkeepTile = ({ pose = BarkeepPose.Normal }: BarkeepTileProps) => {
  return <Emoji>{barkeepFaces[pose]}</Emoji>;
};

const barkeepStats = stats(30, 20, 6, 5, 10);

type BarkeepState = {
  pose: BarkeepPose;
};

const BarkeepStateKey = Symbol("Barkeep");
const initialState = { pose: BarkeepPose.Normal };

const barkeepActivities = text`
spits in a glass and begins polishing it with a filthy rag
begins pushing grime around the floor with an even grimier mop
humming an out-of-time tune
glaring at customers sullenly
arguing with a drunk who has not paid their tab since the last moon
`;

export const Barkeep = () => {
  const rng = useRng();
  const terminal = useTerminal();
  const [state, setState] = useEntityState<BarkeepState>(
    BarkeepStateKey,
    initialState
  );
  hasTile(BarkeepTile, GridLayers.Actor, state);
  hasStats(barkeepStats);
  // TODO: Switch between movements depending on faction
  hasRandomMovement();
  const faction = hasFaction(Factions.NPC);

  return (
    <Monster>
      <Card>
        <Name>Barkeep</Name>
        <Description>
          <BarkeepTile /> A grisled and experienced tavern landlord.
        </Description>
      </Card>
    </Monster>
  );
  +dtgefghfdhsfe;
};

const neutralPerson = [
  "👱",
  "👱🏻",
  "👱🏼",
  "👱🏽",
  "👱🏾",
  "👱🏿",
  "🧓",
  "🧓🏻",
  "🧓🏼",
  "🧓🏽",
  "🧓🏾",
  "🧓🏿",
  "🧑",
  "🧑🏻",
  "🧑🏼",
  "🧑🏽",
  "🧑🏾",
  "🧑🏿",
];

const malePerson = [
  "👴",
  "👴🏻",
  "👴🏼",
  "👴🏽",
  "👴🏾",
  "👴🏿",
  "👨‍🦳",
  "👨🏻‍🦳",
  "👨🏼‍🦳",
  "👨🏽‍🦳",
  "👨🏾‍🦳",
  "👨🏿‍🦳",
  "👱‍♂️",
  "👱🏻‍♂️",
  "👱🏼‍♂️",
  "👱🏽‍♂️",
  "👱🏾‍♂️",
  "👱🏿‍♂️",
  "🧔",
  "🧔🏻",
  "🧔🏼",
  "🧔🏽",
  "🧔🏾",
  "🧔🏿",
  "👨",
  "👨🏻",
  "👨🏼",
  "👨🏽",
  "👨🏾",
  "👨🏿",
  "👨‍🦱",
  "👨🏻‍🦱",
  "👨🏼‍🦱",
  "👨🏽‍🦱",
  "👨🏾‍🦱",
  "👨🏿‍🦱",
  "👨‍🦰",
  "👨🏻‍🦰",
  "👨🏼‍🦰",
  "👨🏽‍🦰",
  "👨🏾‍🦰",
  "👨🏿‍🦰",
];
const femalePerson = [
  "👱‍♀️",
  "👱🏻‍♀️",
  "👱🏼‍♀️",
  "👱🏽‍♀️",
  "👱🏾‍♀️",
  "👱🏿‍♀️",
  "👩",
  "👩🏻",
  "👩🏼",
  "👩🏽",
  "👩🏾",
  "👩🏿",
  "👵",
  "👵🏻",
  "👵🏼",
  "👵🏽",
  "👵🏾",
  "👵🏿",
  "👩‍🦱",
  "👩🏻‍🦱",
  "👩🏼‍🦱",
  "👩🏽‍🦱",
  "👩🏾‍🦱",
  "👩🏿‍🦱",
  "👩‍🦰",
  "👩🏻‍🦰",
  "👩🏼‍🦰",
  "👩🏽‍🦰",
  "👩🏾‍🦰",
  "👩🏿‍🦰",
  "👩‍🦳",
  "👩🏻‍🦳",
  "👩🏼‍🦳",
  "👩🏽‍🦳",
  "👩🏾‍🦳",
  "👩🏿‍🦳",
];
const PatronTile = () => (
  <>
    <Emoji>😁</Emoji>
    <Emoji>🍺</Emoji>
  </>
);

const patronStats = stats(20, 10, 4, 2, 7);

export const Patron = () => {
  const rng = useRng();
  const terminal = useTerminal();
  hasTile(PatronTile);
  hasStats(patronStats);
  // TODO: Switch between movements depending on faction
  hasRandomMovement();
  const faction = hasFaction(Faction.Player);

  onTurn(() => {
    terminal.write(patronBanter(rng));
  });

  return (
    <Monster>
      <Card>
        <Name>Beer-swilling patron</Name>
        <Description>
          <PatronTile /> This inebriate reeks of stale beer and has a distinctly
          unwashed look about them.
          {faction !== Faction.Player
            ? `They are not looking too friendly.`
            : `They are stumbling around happily.`}
        </Description>
      </Card>
    </Monster>
  );
};

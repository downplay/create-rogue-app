import { hasRandomMovement } from "../../behaviours/hasRandomMovement";
import { GridLayers } from "../../../engine/grid";
import { hasFaction, Factions } from "../../behaviours/hasFaction";
import { text } from "herotext";
import { hasStats, stats } from "../../../mechanics/hasStats";
import { hasTile } from "../../../mechanics/hasTile";

enum BarkeepPose {
  Normal,
  Sweating,
}

const barkeepStats = stats(30, 20, 6);

type BarkeepState = {
  pose: BarkeepPose;
};

const barkeepActivities = text`
spits in a glass and begins polishing it with a filthy rag
begins pushing grime around the floor with an even grimier mop
humming an out-of-time tune
glaring at customers sullenly
arguing with a drunk who has not paid their tab since the last moon
`;

export const Barkeep = text<BarkeepState>`
Type:
Barkeep

Describe:
A grisled and experienced tavern landlord.

${hasTile("😃", GridLayers.Actor)}
${hasStats(barkeepStats)}
// TODO: Switch between movements depending on faction
${hasRandomMovement}
${hasFaction(Factions.NPC)}

Tile:=
$faces

onTurn:
{10%}$pose=[Normal|Sweating]
{10%}$the($Name) ${barkeepActivities}
{0}

pose:=
${BarkeepPose.Normal}

faces:
{$pose=Normal}😃
{$pose=Sweating}😅
{0}Missing Barkeep pose $pose

`;

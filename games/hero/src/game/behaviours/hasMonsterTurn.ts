import { inheritStrand, ReturnCommand, text } from "herotext";
import { GameState } from "../../engine/game";

type HasMonsterTurnState = { game: GameState; delta: number };

export const hasMonsterTurn = (
  idleTurnLength = 1,
  turnRandomisation = 0.1
) => text<HasMonsterTurnState>`
setup:~
$waitForNextTurn(${idleTurnLength})

onTurn:~
{0}The $lower($Name) does nothing.$waitForTurn(${idleTurnLength})

waitForTurn: ($delta)
// TODO: $game.enqueueTurn ... ?
// TODO: Also, get inferred speed from stats (? - does speed affect everything?)
$enqueueTurn(${({ delta }, { rng }) =>
  rng.range(
    (delta || idleTurnLength) / (1 + turnRandomisation),
    (delta || idleTurnLength) * (1 + turnRandomisation)
  )})$onTurn//TODO: Default param values

enqueueTurn: ($delta)
${({ game }, context, strand) => {
  const inputStrand = strand.children[0] || inheritStrand(strand);
  strand.children[0] = inputStrand;
  if (typeof inputStrand.internalState !== "undefined") {
    return [inputStrand.internalState as string];
  }
  // TODO: strand context should be suspended instead
  context.suspend = true;
  return [
    {
      type: "trigger",
      handler: "TurnQueue",
      strand: inputStrand,
    } as ReturnCommand,
  ];
}}
`;

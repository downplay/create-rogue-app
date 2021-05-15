import { merge, text, MainAST } from "@hero/text";
import { base } from "./base";

type EncounterState = {};

const baseEncounter = text`
Narrative:
You encounter a bugged encounter.
`;

export const encounter = <TState, TGame = {}>(
  story: MainAST<EncounterState & TGame & TState>
): MainAST<EncounterState & TState & TGame> => {
  const main = merge(baseEncounter, story);
  return base(main);
};

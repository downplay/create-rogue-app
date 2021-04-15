import { merge, text, MainAST, commonFunctions } from "herotext";
import { grammarHelpers } from "./grammarHelpers";

export type BaseState = {
  Name: string;
};

const baseStory = text`
Type:
${() => {
  // TODO: Herotext built-in error throwing (poss: $! or @!)
  // TODO: Also somehow get better data from the ast to debug
  // what is throwing it
  throw new Error("Missing Type in story!");
}}

Name:=
$lower($Type)

setup:+~
{0}
`;

export const base = <TState, TGame = {}>(
  story: MainAST<
    BaseState & TGame & TState
  > /* | EntityFactory<TState, TGame> */
): MainAST<BaseState & TState & TGame> => {
  const main = merge(commonFunctions, grammarHelpers, baseStory, story);
  return main;
};

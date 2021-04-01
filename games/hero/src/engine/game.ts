import { storyInstance, MainAST } from "herotext";
import { TurnState } from "./turn";

export type GameState = TurnState;

export const game = (main: MainAST) => storyInstance<GameState>(main);

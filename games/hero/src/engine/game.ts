import { createInstance, MainAST } from "@hero/text";
import { TurnState } from "./turn";

export type GameState = TurnState;

export const game = (main: MainAST) => createInstance<GameState>(main);

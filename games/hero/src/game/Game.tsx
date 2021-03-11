import { text } from "herotext";
import { game } from "../engine/game";

const gameStory = text`
> create rogue ~@pp v${process.env.REACT_APP_VERSION}

$goto(RoomEncounter)

Name: Game
`;

export const Game = game(gameStory);

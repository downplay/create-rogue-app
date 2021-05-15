import { text } from "@hero/text";
import { game } from "../engine/game";

const gameStory = text`
[> create rogue ~@pp v${process.env.REACT_APP_VERSION}
$goto(RoomEncounter)]

Type:
Game
`;

export const HeroGame = game(gameStory);

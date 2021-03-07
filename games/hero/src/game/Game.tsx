import { text } from "herotext";

const gameStory = text`
> create rogue ~@pp v${process.env.REACT_APP_VERSION}

$goto(RoomEncounter)

Name: Game
`;

export const Game = () => entity(() => gameStory);

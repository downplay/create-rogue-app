import { text } from "herotext";
import { goTo } from "./goTo";

export const baseCommands = text`
goto: ($location)
${({ locations, location }) => goTo(locations[location])}
`;

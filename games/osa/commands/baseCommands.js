import { text } from "herotext";

export const baseCommands = text`
goto: ($location)
${({ location, engine }) => engine.go(location)}
`;

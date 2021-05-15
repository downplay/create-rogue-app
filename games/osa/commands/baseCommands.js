import { text } from "@hero/text";

export const baseCommands = text`
goto: ($location)
${({ location, engine }) => engine.go(location)}
`;

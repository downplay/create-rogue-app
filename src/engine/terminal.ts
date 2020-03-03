import { TerminalState, TerminalContext } from "../game/types";
import { createContext } from "../helpers/createContext";

export const [useTerminal, TerminalProvider] = createContext<TerminalContext>();

export const terminalActions = {
  write: (text: string) => (terminal: TerminalState) => {
    terminal.messages.push(text);
  }
};

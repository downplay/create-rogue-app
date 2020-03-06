import { TerminalState, TerminalActions } from "../game/types";
import { createContext } from "../helpers/createContext";

export const [useTerminal, TerminalProvider] = createContext<TerminalActions>();
export const [useTerminalState, TerminalStateProvider] = createContext<
  TerminalState
>();

export const terminalActions = {
  write: (text: string) => (terminal: TerminalState) => {
    terminal.messages.push(text);
  }
};

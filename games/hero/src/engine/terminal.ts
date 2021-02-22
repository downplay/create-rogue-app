import { TerminalState, TerminalActions } from "../game/types";
import { createContext } from "../helpers/createContext";
import { produce } from "immer";

export const [useTerminal, TerminalProvider] = createContext<TerminalActions>();
export const [useTerminalState, TerminalStateProvider] = createContext<
  TerminalState
>();

export const terminalMutations = {
  write: (text: string) => (
    terminal: TerminalState
  ): [TerminalState, undefined] => {
    return [
      produce(terminal, terminal => {
        terminal.messages.push(text);
      }),
      undefined
    ];
  }
};

export const terminalQueries = {};

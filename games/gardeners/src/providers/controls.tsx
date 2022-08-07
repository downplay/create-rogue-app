import  { useEffect, useRef, useMemo, PropsWithChildren } from "react";
import { createContext } from "../helpers/createContext";
import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN,
  KEY_NUMPAD4,
  KEY_NUMPAD8,
  KEY_NUMPAD6,
  KEY_NUMPAD2,
  KEY_NUMPAD7,
  KEY_NUMPAD9,
  KEY_NUMPAD3,
  KEY_NUMPAD1
} from "keycode-js";

export enum Commands {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  MoveNW,
  MoveNE,
  MoveSE,
  MoveSW
}

type ControlsContext = {
  bind: (
    commands: Commands[],
    handler: (command: Commands) => void
  ) => () => void;
};

const [useControlsContext, Provider] = createContext<ControlsContext>();

export const useControls = (
  commands: Commands[],
  handler: (command: Commands) => void
) => {
  const controls = useControlsContext();
  useEffect(() => controls.bind(commands, handler), [commands, handler]);
};

type Handlers = Record<Commands, Array<(command: Commands) => void>>;

const keys: Record<number, Commands> = {
  [KEY_LEFT]: Commands.MoveLeft,
  [KEY_NUMPAD4]: Commands.MoveLeft,
  [KEY_RIGHT]: Commands.MoveRight,
  [KEY_NUMPAD6]: Commands.MoveRight,
  [KEY_UP]: Commands.MoveUp,
  [KEY_NUMPAD8]: Commands.MoveUp,
  [KEY_DOWN]: Commands.MoveDown,
  [KEY_NUMPAD2]: Commands.MoveDown,
  [KEY_NUMPAD7]: Commands.MoveNW,
  [KEY_NUMPAD9]: Commands.MoveNE,
  [KEY_NUMPAD3]: Commands.MoveSE,
  [KEY_NUMPAD1]: Commands.MoveSW
};

export const ControlsProvider = ({ children }: PropsWithChildren<{}>) => {
  const handlersRef = useRef<Handlers>({} as Handlers);

  const context = useMemo<ControlsContext>(() => {
    return {
      bind: (commands: Commands[], handler: (command: Commands) => void) => {
        for (const command of commands) {
          handlersRef.current[command] = handlersRef.current[command] || [];
          handlersRef.current[command].push(handler);
        }
        return () => {
          for (const command of commands) {
            handlersRef.current[command] = handlersRef.current[command].filter(
              callback => handler !== callback
            );
          }
        };
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", e => {
      const command = keys[e.keyCode];
      if (command !== undefined) {
        e.preventDefault();
        for (const handler of handlersRef.current[command]) {
          // TODO: Maybe use actions with additional params
          // TODO: Also, commands need to go to a queue so they can be process on turn
          handler(command);
        }
      } else {
        console.error("Unknown binding: " + e.keyCode);
      }
    });
  }, []);

  return <Provider value={context}>{children}</Provider>;
};

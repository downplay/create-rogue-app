import produce from "immer";
import { ComponentType, PropsWithChildren, useMemo, useState } from "react";
import { createContext } from "../helpers/createContext";

interface IComponentInstance {
  component: ComponentType<any>;
  props: Record<string, any>;
}

type WindowsContext = {
  windows: Record<string, IComponentInstance[]>;
};

const [useWindowsContext, Provider] = createContext<WindowsContext>();

export const WindowsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [windows, updateWindows] = useState<
    Record<string, IComponentInstance[]>
  >({});
  function addComponent<T extends {}>(
    windowName: string,
    component: ComponentType<T>,
    props: T
  ) {
    updateWindows((value) =>
      produce(value, (draft) => {
        if (!draft[windowName]) {
          draft[windowName] = [];
        }
        draft[windowName].push({
          component,
          props,
        });
      })
    );
  }
  const context = useMemo<WindowsContext>(() => {
    return {
      windows,
      addComponent,
    };
  }, [windows]);

  return <Provider value={context}>{children}</Provider>;
};

export const useWindow = (name: string) => {
  const context = useWindowsContext();
  return context.windows[name] || [];
};

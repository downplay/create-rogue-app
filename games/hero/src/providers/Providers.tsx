import { ControlsProvider } from "./controls";

export const Providers = ({ children }: React.PropsWithChildren<{}>) => {
  return <ControlsProvider>{children}</ControlsProvider>;
};

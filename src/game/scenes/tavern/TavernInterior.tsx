import React, { useMemo, useEffect } from "react";
import { Room } from "../../levels/Room";
import { multiply, vector } from "../../../engine/vector";
import { TavernState } from "./types";
import { useTerminal } from "../../../engine/terminal";
import { tavernInteriorDescription } from "./text";
import { useRng } from "../../../engine/useRng";

type Props = { state: TavernState };

export const TavernInterior = ({ state }: Props) => {
  const terminal = useTerminal();
  const rng = useRng();
  // TODO: Need an equivalent of useEffect but it persists its
  // dependencies (or lack of) so when the entity reloads we don't need
  // to run the effect again.
  useEffect(() => {
    terminal.write(tavernInteriorDescription(rng, { tavernName: state.name }));
  });
  const [size, origin] = useMemo(() => {
    const size = multiply(state.size, 2);
    const origin = vector(40, 40);
    return [size, origin];
  }, [state.size]);
  return <Room size={size} origin={origin} />;
};

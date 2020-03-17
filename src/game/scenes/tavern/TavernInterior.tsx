import React, { useMemo, useEffect } from "react";
import { Room } from "../../levels/Room";
import { multiply, vector } from "../../../engine/vector";
import { TavernState } from "./types";

type Props = { state: TavernState };

export const TavernInterior = ({ state }: Props) => {
  // TODO: Need an equivalent of useEffect but it persists its
  // dependencies (or lack of) so when the entity reloads we don't need
  // to run the effect again.
  useEffect(() => {});
  const [size, origin] = useMemo(() => {
    const size = multiply(state.size, 2);
    const origin = vector(40, 40);
    return [size, origin];
  }, [state.size]);
  return <Room size={size} origin={origin} />;
};

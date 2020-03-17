import React, { useCallback } from "react";
import { Room } from "../../levels/Room";
import { Door } from "../../levels/Door";
import { useMemo } from "react";
import { PositionProps } from "../../../engine/hasPosition";
import { useEntityState } from "../../../engine/useEntityState";
import { TavernState, TavernScene, TavernStateKey } from "./types";
import { Roof } from "../../levels/Roof";
import { vector, add, subtract } from "../../../engine/vector";
import { Sign } from "./Sign";

export const TavernEntrance = ({ ...rest }: PositionProps) => {
  const [state, setState] = useEntityState<TavernState>(TavernStateKey);

  const handleEnterInterior = useCallback(() => {
    setState({
      ...state,
      scene: TavernScene.Interior
    });
  }, [state]);

  return <Door {...rest} onEnter={handleEnterInterior} />;
};

type Props = {
  state: TavernState;
};

export const TavernExterior = ({ state }: Props) => {
  const [doors, origin, signPosition] = useMemo(
    () =>
      state.spawn
        ? [
            [state.door],
            subtract(state.spawn, state.door),
            add(state.spawn, vector(1, 1))
          ]
        : [],
    [state.door, state.spawn]
  );
  return state.spawn ? (
    <Room
      size={state.size}
      origin={origin}
      DoorComponent={TavernEntrance}
      FloorComponent={Roof}
      doors={doors}
    >
      <Sign tavernName={state.name} position={signPosition!} />
    </Room>
  ) : null;
};

import React, { useMemo, memo, PropsWithChildren } from "react";
import { Vector, reduceQuad, sortCorners } from "../../engine/vector";
import { Wall } from "./Wall";
import { Floor } from "./Floor";

export enum CorridorOrientation {
  Horizontal,
  Vertical
}

type Props = {
  start: Vector;
  end: Vector;
  orientation: CorridorOrientation;
};

export const Corridor = memo(
  ({ start, end, orientation, children }: PropsWithChildren<Props>) => {
    // TODO: Wall/Floor, to be overridable in props, but also can be derived from current biome
    const tiles = useMemo(() => {
      const [a, b] = sortCorners(start, end);
      return reduceQuad(a, b, value => (
        <Floor key={`${value.x}_${value.y}`} position={value} />
      ));
    }, [start, end, orientation]);

    return (
      <>
        {tiles}
        {children}
      </>
    );
  }
);

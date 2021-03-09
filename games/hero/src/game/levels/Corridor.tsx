import React, { useMemo, memo, PropsWithChildren } from "react";
import { Vector, reduceQuad, sortCorners } from "herotext";
import { Floor } from "./Floor";
import { useRng } from "../../engine/useRng";
import { Wall } from "./Wall";

export enum CorridorOrientation {
  Horizontal,
  Vertical,
}

export type CorridorProps = {
  start: Vector;
  end: Vector;
  orientation: CorridorOrientation;
};

export const Corridor = memo(
  ({ start, end, orientation, children }: PropsWithChildren<CorridorProps>) => {
    // TODO: Wall/Floor, to be overridable in props, but also can be derived from current biome
    const rng = useRng();
    const tiles = useMemo(() => {
      // Used for switching the axes we operate on, everything else is symmetrical
      // although it makes the rest of the code a bit harder to follow :)
      const axes: (keyof Vector)[] =
        orientation === CorridorOrientation.Vertical ? ["x", "y"] : ["y", "x"];
      let [cornerA, cornerB] = sortCorners(start, end);
      // Expand the region along the perpendicular by 1 tile to draw containing walls
      // TODO: A better system for drawing maps would just fill all non-floor tiles with wall
      // then we wouldn't have to be so careful about this (and works with e.g. tunnelling spells)
      const quadA = { ...cornerA, [axes[0]]: cornerA[axes[0]] - 1 };
      const quadB = { ...cornerB, [axes[0]]: cornerB[axes[0]] + 1 };
      // There is a "kink" in the corridor since it's not usually a straight line, this can
      // occur anywhere along the axis of orientation
      const kink = rng.integer(cornerA[axes[1]], cornerB[axes[1]]);
      return reduceQuad(quadA, quadB, (value) =>
        // Note: This logic heavily assumes that start and end go either N->S or W->E despite the
        // corner normalisation, will break if used carelessly!
        (value[axes[0]] === start[axes[0]] && value[axes[1]] < kink) ||
        (value[axes[0]] === end[axes[0]] && value[axes[1]] > kink) ||
        (value[axes[0]] >= cornerA[axes[0]] &&
          value[axes[0]] <= cornerB[axes[0]] &&
          value[axes[1]] === kink) ? (
          <Floor key={`${value.x}_${value.y}`} position={value} />
        ) : (
          <Wall key={`${value.x}_${value.y}`} position={value} />
        )
      );
    }, [start, end, orientation]);

    return (
      <>
        {tiles}
        {children}
      </>
    );
  }
);

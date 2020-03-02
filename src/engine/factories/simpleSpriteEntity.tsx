import React from "react";
import { hasTile } from "../hasTile";
import { useCallback } from "react";
import { entity } from "../entity";
import { PositionProps, hasPosition } from "../hasPosition";

type Props = {
  name: string;
  glyph: string;
};

export const simpleSpriteEntity = ({ name, glyph }: Props) => {
  const component = entity(({ position }: PositionProps) => {
    const TileComponent = useCallback(() => <>{glyph}</>, [name, glyph]);
    hasPosition(position);
    hasTile(TileComponent);
    return null;
  });
  component.displayName = name;
  return component;
};

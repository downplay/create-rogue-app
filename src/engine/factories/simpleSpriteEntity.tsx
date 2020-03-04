import React, { ComponentType, PropsWithChildren } from "react";
import { hasTile } from "../hasTile";
import { entity } from "../entity";
import { PositionProps, hasPosition } from "../hasPosition";

export const simpleTileEntity = (name: string, tile: ComponentType) => {
  const component = ({
    position,
    children
  }: PropsWithChildren<PositionProps>) => {
    hasPosition(position);
    hasTile(tile);
    return children;
  };
  component.displayName = name;
  return entity(component as any);
};

export const simpleSpriteEntity = (name: string, glyph: string) => {
  const TileComponent = () => <>{glyph}</>;
  return simpleTileEntity(name, TileComponent);
};

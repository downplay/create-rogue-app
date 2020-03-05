import React, { ComponentType, PropsWithChildren } from "react";
import { hasTile } from "../hasTile";
import { entity } from "../entity";
import { PositionProps, hasPosition } from "../hasPosition";

export const simpleTileEntity = (name: string, tile: ComponentType) => {
  const component = ({ position }: PropsWithChildren<PositionProps>) => {
    hasPosition(position);
    hasTile(tile);
    // TODO: don't really need it for simple entity; but why oh why will typescript
    //       not tolerate me returning children from this component?
    // return children;
    return null;
  };
  component.displayName = name;
  return entity(component);
};

export const simpleSpriteEntity = (name: string, glyph: string) => {
  const TileComponent = () => <>{glyph}</>;
  return simpleTileEntity(name, TileComponent);
};

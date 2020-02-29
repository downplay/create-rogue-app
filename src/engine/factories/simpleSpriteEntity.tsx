import React from "react";
import { hasTile } from "../hasTile";
import { useCallback } from "react";
import { entity } from "../entity";

type Props = {
  name: string;
  glyph: string;
};

export const simpleSpriteEntity = ({
  name,
  glyph
}: Props): React.ComponentType => {
  const component = entity(() => {
    const TileComponent = useCallback(() => <>{glyph}</>, [name, glyph]);
    hasTile(TileComponent);
    return null;
  });
  component.displayName = name;
  return component;
};

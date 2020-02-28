import { Vector } from "./vector";
import { useEffect } from "react";

export const hasTile = (
  TileComponent: React.ComponentType,
  position: Vector
) => {
  const map = useMapContext();

  useEffect(() => {}, [position, TileComponent]);
};

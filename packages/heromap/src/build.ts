import { RNG } from "herotext";
import {
  MapNode,
  NumberNode,
  OperationNode,
  OperationGroupNode,
} from "./types";

type VirtualGrid<T> = {
  width: number;
  height: number;
  rows: T[][][];

  add: (x: number, y: number, element: T) => void;
  get: (x: number, y: number) => T[];
};

const executeOp = (
  map: MapNode,
  grid: VirtualGrid<MapElement>,
  op: OperationNode,
  rng: RNG
) => {
  switch (op.type) {
    case "Heromap::OperationGroupNode":
      (op as OperationGroupNode).operations;
    case "Heromap::ReplaceGlyphBrushNode":
    case "Heromap::MatchGroupNode":
  }
};

export type MapElement = {};

const virtualGrid = <T>(width: number, height: number): VirtualGrid<T> => {
  const internalGrid: Record<number, Record<number, MapElement[]>> = {};

  const add = (x: number, y: number, ...elements: MapElement[]) => {
    if (!internalGrid[y]) {
      internalGrid[y] = {};
    }
    if (!internalGrid[x]) {
      internalGrid[y][x] = [];
    }
    internalGrid[y][x].push(...elements);
  };

  const get = (x: number, y: number): MapElement[] => {
    if (!internalGrid[y] || !internalGrid[y][x]) {
      return [];
    }
  };

  const grid = {
    width,
    height,
    add,
    get,
  };
  return grid;
};

export const build = (map: MapNode, rng: RNG, scope: Record<string, any>) => {
  const width = Math.max(...map.map.map((line) => line.length));
  const height = map.map.length;
  const rows = map.map.slice();
  const grid = virtualGrid<MapElement>(width, height);
  for (const op of map.legend) {
    executeOp(map, grid, op, rng);
  }
  // TODO: Any other metadata?
  return { grid };
};

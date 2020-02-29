import { Vector } from "./vector";
import { GridState, GridContext } from "../game/types";
import { createContext } from "../helpers/createContext";

type Tile = {
  TileComponent: React.ComponentType;
};

export type Cell = {
  x: number;
  y: number;
  tiles: Tile[];
};

export type Row = Cell[];

export type Grid = Row[];

export const [useGrid, GridProvider] = createContext<GridContext>();

export const gridActions = {
  addTile: (position: Vector, TileComponent: React.ComponentType) => (
    grid: GridState
  ) => {
    grid.map[position.x][position.y].tiles.push({ TileComponent });
  }
};

export const blankGrid = (width: number, height: number) => {
  const grid: Grid = [];
  for (let y: number = 0; y < height; y++) {
    const row: Row = [];
    grid.push(row);
    for (let x: number = 0; x < width; x++) {
      row.push({ x: 0, y: 0, tiles: [] });
    }
  }
  return grid;
};

import { Vector } from "./vector";
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

export const gridActions = {
  addTile: (position: Vector, Component: React.ComponentType) => {}
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

import { Vector, vector } from "./vector";
import { v4 } from "uuid";

import { GridState, GridContext } from "../game/types";
import { createContext } from "../helpers/createContext";

type Tile = {
  id: string;
  TileComponent: React.ComponentType;
};

type TileHandle = {
  tile: Tile;
  position: Vector;
};

export type Cell = {
  tiles: Tile[];
  position: Vector;
};

export type Row = Cell[];

export type Grid = Row[];

export const [useGrid, GridProvider] = createContext<GridContext>();

export const gridActions = {
  addTile: (position: Vector, TileComponent: React.ComponentType) => (
    grid: GridState
  ): TileHandle => {
    const tile = { TileComponent, id: v4() };
    grid.map[position.y][position.x].tiles.push(tile);
    return { tile, position };
  },
  removeTile: (handle: TileHandle) => (grid: GridState) => {
    const tiles = grid.map[handle.position.y][handle.position.x].tiles;
    const index = tiles.findIndex(tile => tile.id === handle.tile.id);
    console.log("removing");
    if (index >= 0) {
      console.log("really removing");
      tiles.splice(index, 1);
    }
  }
};

export const blankGrid = (width: number, height: number) => {
  const grid: Grid = [];
  for (let y: number = 0; y < height; y++) {
    const row: Row = [];
    grid.push(row);
    for (let x: number = 0; x < width; x++) {
      row.push({ position: vector(x, y), tiles: [] });
    }
  }
  return grid;
};

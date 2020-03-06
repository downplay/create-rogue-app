import { Vector, vector } from "./vector";
import { v4 } from "uuid";

import { GridState, GridActions } from "../game/types";
import { createContext } from "../helpers/createContext";

// TODO: use this
export enum GridLayers {
  Floor,
  Trash,
  Item,
  Actor,
  Costume,
  Fx
}

export type Tile = {
  id: string;
  TileComponent: React.ComponentType;
  z: number;
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

export const [useGrid, GridProvider] = createContext<GridActions>();
export const [useGridState, GridStateProvider] = createContext<GridState>();

export const gridActions = {
  addTile: (position: Vector, TileComponent: React.ComponentType, z = 0) => (
    grid: GridState
  ): TileHandle => {
    const tile = { TileComponent, id: v4(), z };
    grid.map[position.y][position.x].tiles.push(tile);
    return { tile, position };
  },
  removeTile: (handle: TileHandle) => (grid: GridState) => {
    const tiles = grid.map[handle.position.y][handle.position.x].tiles;
    const index = tiles.findIndex(tile => tile.id === handle.tile.id);
    if (index >= 0) {
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

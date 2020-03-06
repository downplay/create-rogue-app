import { Vector, vector } from "./vector";
import { v4 } from "uuid";

import { createContext } from "../helpers/createContext";
import { EntityContext } from "./useEntitiesState";

// TODO: use this
export enum GridLayers {
  Floor = 0,
  Trash = 1,
  Item = 2,
  Actor = 3,
  Costume = 4,
  Fx = 5
}

export type Tile = {
  id: string;
  TileComponent: React.ComponentType;
  layer: GridLayers;
  position: Vector;
  entity?: EntityContext;
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

export type TileFilterPredicate = (
  tile: Tile,
  cell: Cell
) => boolean | undefined;

export type GridState = {
  map: Grid;
};

export type GridActions = {
  addTile: (
    position: Vector,
    TileComponent: React.ComponentType,
    layer?: GridLayers,
    entity?: EntityContext
  ) => TileHandle;
  removeTile: (handle: TileHandle) => void;
  findTiles: (predicate: TileFilterPredicate) => Tile[];
  getCell: (at: Vector) => Cell;
};

export type GridContext = GridState & GridActions;

export const [useGrid, GridProvider] = createContext<GridActions>();
export const [useGridState, GridStateProvider] = createContext<GridState>();

export const gridMutations = {
  addTile: (
    position: Vector,
    TileComponent: React.ComponentType,
    layer: GridLayers = GridLayers.Floor,
    entity?: EntityContext
  ) => (grid: GridState): Tile => {
    const tile: Tile = { TileComponent, id: v4(), layer, position, entity };
    grid.map[position.y][position.x].tiles.push(tile);
    return tile;
  },
  removeTile: (handle: Tile) => (grid: GridState) => {
    const tiles = grid.map[handle.position.y][handle.position.x].tiles;
    const index = tiles.findIndex(tile => tile.id === handle.id);
    if (index >= 0) {
      tiles.splice(index, 1);
    }
  }
};

export const gridQueries = {
  findTiles: (predicate: TileFilterPredicate) => (grid: GridState): Tile[] => {
    const found = [];
    for (const row of grid.map) {
      for (const cell of row) {
        console.log(cell);
        for (const tile of cell.tiles) {
          if (predicate(tile, cell)) {
            found.push(tile);
          }
        }
      }
    }
    return found;
  },
  getCell: (at: Vector) => (grid: GridState): Cell => grid.map[at.y][at.x]
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

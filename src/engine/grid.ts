import { Vector, vector } from "./vector";
import { GridState, GridContext } from "../game/types";
import { createContext } from "../helpers/createContext";

type Tile = {
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
    const tile = { TileComponent };
    console.log("adding", TileComponent, position);
    grid.map[position.x][position.y].tiles.push(tile);
    return { tile, position };
  },
  removeTile: (handle: TileHandle) => (grid: GridState) => {
    console.log("removing");
    const tiles = grid.map[handle.position.x][handle.position.y].tiles;
    tiles.splice(tiles.indexOf(handle.tile), 1);
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

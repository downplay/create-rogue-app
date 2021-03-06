import { Vector, vector } from "../math/vector";
import { v4 } from "uuid";

import { createContext } from "../helpers/createContext";
import { EntityContext, useEvent } from "./useEntitiesState";
import { produce } from "immer";

// TODO: use this
export enum GridLayers {
  Floor = 0,
  Trash = 1,
  Item = 2,
  Actor = 3,
  Costume = 4,
  Fx = 5,
}

export type Tile = {
  id: string;
  TileComponent: React.ComponentType<any>;
  layer: GridLayers;
  position: Vector;
  entity?: EntityContext;
  state?: any;
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

export type SeenCell = Cell & {
  /**
   * Whether cell is currently in view and in LOS
   * (will be darkened if not, even if some knowledge of what was there)
   */
  inView: boolean;

  /**
   * Link to the Cell this was derived from. Used for equality checks to know if the cell
   * needs regenerating now.
   */
  fromCell: Cell;

  // TODO: Maybe no point having position here since it's also in the map cell
};

// TODO: Not so keen on "Seen" prefix ... "Known"? "Los"? "View"?
export type SeenGrid = SeenCell[][];

export type GridState = {
  map: Grid;
  seen: SeenGrid;
};

export type GridActions = {
  addTile: <T extends {}, S>(
    position: Vector,
    TileComponent: React.ComponentType<T>,
    layer?: GridLayers,
    entity?: EntityContext,
    state?: S
  ) => Tile;
  updateTileState: (handle: Tile, state: any) => Tile;
  removeTile: (handle: Tile) => void;
  findTiles: (predicate: TileFilterPredicate) => Tile[];
  getCell: (at: Vector) => Cell;
  updateSeen: (seen: SeenGrid) => void;
};

export type GridContext = GridState & GridActions;

export const [useGrid, GridProvider] = createContext<GridActions>();
export const [useGridState, GridStateProvider] = createContext<GridState>();

export const gridMutations = {
  addTile: <T, S>(
    position: Vector,
    TileComponent: React.ComponentType<T>,
    layer: GridLayers = GridLayers.Floor,
    entity?: EntityContext,
    state?: S
  ) => (grid: GridState): [GridState, Tile] => {
    const tile: Tile = {
      TileComponent,
      id: v4(),
      layer,
      position,
      entity,
      state,
    };
    // TODO: Following grid expansion code didn't work (because of immer proxy)
    // can be reinstated now but need to handle seen grid too
    // if (!original.map[position.y]) {
    //   grid.map[position.y] = [];
    // }
    // if (!original.map[position.y]?.[position.x]) {
    //   grid.map[position.y][position.x] = {
    //     position: { ...position },
    //     tiles: []
    //   };
    // }
    if (!grid.map[position.y]?.[position.x]) {
      throw new Error("No cell at " + position.x + ", " + position.y);
    }
    return [
      produce(grid, (grid) => {
        grid.map[position.y][position.x].tiles.push(tile);
      }),
      tile,
    ];
  },
  updateTileState: (handle: Tile, state: any) => (
    grid: GridState
  ): [GridState, Tile] => {
    const tiles = grid.map[handle.position.y]?.[handle.position.x]?.tiles;
    if (!tiles) {
      return [grid, handle];
    }
    // Slightly contorted map so we can retrieve the newly generated item to return as handle
    let newHandle: Tile | undefined;
    const newTiles = tiles.map((tile) => {
      // TODO: Can't remember why refs didn't work and id was needed...
      if (tile.id === handle.id) {
        newHandle = { ...tile, state };
        return newHandle;
      }
      return tile;
    });
    if (newHandle) {
      const newGrid = produce(grid, (grid) => {
        grid.map[handle.position.y][handle.position.x].tiles = newTiles;
      });
      return [newGrid, newHandle! || handle];
    }
    return [grid, handle];
  },
  removeTile: (handle: Tile) => (grid: GridState): [GridState, undefined] => {
    const tiles = grid.map[handle.position.y]?.[handle.position.x]?.tiles;
    const index = tiles?.findIndex((tile) => tile.id === handle.id);
    if (index !== undefined && index >= 0) {
      return [
        produce(grid, (grid) => {
          grid.map[handle.position.y][handle.position.x].tiles.splice(index, 1);
        }),
        undefined,
      ];
    }
    return [grid, undefined];
  },
  updateSeen: (seen: SeenGrid) => (grid: GridState): [GridState, undefined] => {
    return [
      {
        ...grid,
        seen,
      },
      undefined,
    ];
  },
};

export const gridQueries = {
  findTiles: (predicate: TileFilterPredicate) => (grid: GridState): Tile[] => {
    const found = [];
    for (const row of grid.map) {
      for (const cell of row) {
        for (const tile of cell.tiles) {
          if (predicate(tile, cell)) {
            found.push(tile);
          }
        }
      }
    }
    return found;
  },
  getCell: (at: Vector) => (grid: GridState): Cell => grid.map[at.y][at.x],
};

export const blankGrid = (width: number, height: number): Grid => {
  const grid = [];
  for (let y: number = 0; y < height; y++) {
    const row: Row = [];
    grid.push(row);
    for (let x: number = 0; x < width; x++) {
      row.push({ position: vector(x, y), tiles: [] });
    }
  }
  return grid;
};

export const blankSeenGrid = (width: number, height: number): SeenGrid => {
  const grid = [];
  for (let y: number = 0; y < height; y++) {
    const row: SeenCell[] = [];
    grid.push(row);
    for (let x: number = 0; x < width; x++) {
      row.push({
        position: vector(x, y),
        tiles: [],
        inView: false,
        fromCell: { position: vector(x, y), tiles: [] },
      });
    }
  }
  return grid;
};

export const ShowCardEventKey = Symbol("ShowCard");
export const HideCardEventKey = Symbol("HideCard");

export const onCard = (show: () => void, hide: () => void) => {
  useEvent(ShowCardEventKey, show);
  useEvent(HideCardEventKey, hide);
};

import { Vector, vector } from "herotext";
import { virtualGrid } from "heromap";
import { v4 } from "uuid";

import { createContext } from "../helpers/createContext";
import { EntityContext, useEvent } from "./useEntitiesState";
import { produce } from "immer";

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
export type SeenRows = SeenCell[][];

export type Grid = {
  map: Row[];
  seen: SeenRows;
} & GridActions;

export type GridActions = {
  addTile: <T extends {}, S>(
    position: Vector,
    TileComponent: string | React.ComponentType<T>,
    layer?: GridLayers,
    entity?: EntityContext,
    state?: S
  ) => string;
  updateTileState: (handle: Tile, state: any) => Tile;
  removeTile: (handle: string) => void;
  findTiles: (predicate: TileFilterPredicate) => Tile[];
  getCell: (at: Vector) => Cell;
  updateSeen: (seen: SeenRows) => void;
};

export type GridContext = Grid & GridActions;

export const [useGrid, GridProvider] = createContext<GridActions>();
export const [useGridState, GridStateProvider] = createContext<Grid>();

export const gridMutations = {
  addTile: <T, S>(
    position: Vector,
    TileComponent: React.ComponentType<T>,
    layer: GridLayers = GridLayers.Floor,
    entity?: EntityContext,
    state?: S
  ) => (grid: Grid): [Grid, Tile] => {
    const tile: Tile = {
      TileComponent,
      id: v4(),
      layer,
      position,
      entity,
      state,
    };
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
  updateTileState: (handle: Tile, state: any) => (grid: Grid): [Grid, Tile] => {
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
  removeTile: (handle: Tile) => (grid: Grid): [Grid, undefined] => {
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
  updateSeen: (seen: SeenRows) => (grid: Grid): [Grid, undefined] => {
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
  findTiles: (predicate: TileFilterPredicate) => (grid: Grid): Tile[] => {
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
  getCell: (at: Vector) => (grid: Grid): Cell => grid.map[at.y][at.x],
};

export const blankGrid = (width: number, height: number): Row[] => {
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

export const blankSeenGrid = (width: number, height: number): SeenRows => {
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

export const grid = (): Grid => {
  const map = virtualGrid<Cell>();
  const seen = virtualGrid<Cell>();
  const  addTile = <T = {}>(
    position: Vector,
    tile: string | React.ComponentType<T>,
    layer: GridLayers = GridLayers.Floor,
    entity?: EntityContext,
  ) => {
    map.
  }

  return {
    map,
    seen,
  };
};

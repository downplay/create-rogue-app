import { Vector } from "herotext";
import { virtualGrid, VirtualGrid } from "heromap";
import { v4 } from "uuid";

import { EntityContext } from "./useEntitiesState";

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
  content: TileContent<any>;
  layer: GridLayers;
  entity?: EntityContext;
  state?: any;
};

export type TileContent<T> = string | React.ComponentType<T>;

export type TileFilterPredicate = (
  tile: Tile,
  cell: Cell
) => boolean | undefined;

export type Cell = {
  tiles: Tile[];
  position: Vector;
};

export type Row = Cell[];

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
};

// TODO: Not so keen on "Seen" prefix ... "Known"? "Los"? "View"?
export type SeenRows = SeenCell[][];

export type Grid = {
  map: VirtualGrid<Cell>;
  seen: VirtualGrid<SeenCell>;
} & GridActions;

export type GridActions = {
  addTile: <T extends {}, S>(
    position: Vector,
    content: string | React.ComponentType<T>,
    layer?: GridLayers,
    entity?: EntityContext,
    state?: S
  ) => string;
  removeTile: (position: Vector, handle: string) => void;
  updateTileState: (position: Vector, handle: string, state: any) => void;
  findTiles: (predicate: TileFilterPredicate) => [Tile, Cell][];
  getCell: (at: Vector) => Cell | undefined;
  updateSeen: (los: Vector[]) => void;
};

export type GridContext = Grid & GridActions;

export const grid = (): Grid => {
  const map = virtualGrid<Cell>();
  const seen = virtualGrid<SeenCell>();
  const addTile = <T = {}>(
    position: Vector,
    content: TileContent<T>,
    layer: GridLayers = GridLayers.Floor,
    entity?: EntityContext,
    state?: any
  ) => {
    const tile: Tile = {
      id: v4(),
      content,
      layer,
      entity,
      state,
    };
    map.update(position.x, position.y, (current) => {
      const cell: Cell = current || {
        tiles: [],
        position,
      };
      cell.tiles.push(tile);
      return cell;
    });
    return tile.id;
  };

  const removeTile = (position: Vector, handle: string) => {
    map.update(position.x, position.y, (current) => {
      if (current) {
        const index = current.tiles.findIndex((tile) => tile.id === handle);
        if (index >= 0) {
          current.tiles.splice(index, 1);
        }
      }
      return current;
    });
  };

  const findTiles = (predicate: TileFilterPredicate): [Tile, Cell][] =>
    map
      .map((cell) =>
        cell.element.tiles
          .filter((tile) => predicate(tile, cell.element))
          .map((tile) => [tile, cell.element] as [Tile, Cell])
      )
      .flat(1);

  const getCell = (at: Vector) => map.get(at.y, at.x);
  const updateSeen = (los: Vector[]) => {
    // TODO: Set all seen to not in view
    for (const pos of los) {
      const cell = getCell(pos);
      if (!cell) {
        seen.set(pos.x, pos.y, undefined);
      } else {
        seen.set(pos.x, pos.y, {
          // A lot of stuff is still getting copied by ref inside Tile, but that's probably OK
          tiles: cell.tiles.map((tile) => ({ ...tile })),
          position: pos,
          inView: true,
          fromCell: cell,
        });
      }
    }
  };

  const updateTileState = (position: Vector, handle: string, state: any) => {
    map.update(position.x, position.y, (current) => {
      if (current) {
        const tile = current.tiles.find((tile) => tile.id === handle);
        if (tile) {
          tile.state = state;
        }
      }
      return current;
    });
  };

  return {
    map,
    seen,
    addTile,
    removeTile,
    findTiles,
    getCell,
    updateSeen,
    updateTileState,
  };
};

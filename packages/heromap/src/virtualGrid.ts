export type VirtualGrid<T> = {
  width: number;
  height: number;

  set: (x: number, y: number, element: T | undefined) => void;
  get: (x: number, y: number) => T | undefined;
  getAll: () => VirtualGridCell<T>[];
  getRows: () => T[][];
  update: (
    x: number,
    y: number,
    updater: (current: T | undefined) => T | undefined
  ) => void;
  forEach: (action: CellAction<T>) => void;
  find: (predicate: CellFilterPredicate<T>) => T[];
  map: <R>(transform: CellTransform<T, R>) => R[];
};

type VirtualGridCell<T> = {
  x: number;
  y: number;
  element: T;
};

type CellAction<T> = (cell: VirtualGridCell<T>) => void;
type CellFilterPredicate<T> = (cell: VirtualGridCell<T>) => boolean | undefined;
type CellTransform<T, R> = (cell: VirtualGridCell<T>) => R;

export const virtualGrid = <T>(
  width: number = 0,
  height: number = 0
): VirtualGrid<T> => {
  const internalGrid: Record<number, Record<number, VirtualGridCell<T>>> = {};

  const set = (x: number, y: number, element: T | undefined) => {
    if (typeof element === "undefined") {
      if (internalGrid[y]) {
        delete internalGrid[y][x];
      }
      if (Object.keys(internalGrid[y]).length === 0) {
        delete internalGrid[y];
      }
    } else {
      if (!internalGrid[y]) {
        internalGrid[y] = {};
      }
      internalGrid[y][x] = { x, y, element };
    }
  };

  const get = (x: number, y: number): T | undefined => {
    if (!internalGrid[y] || !internalGrid[y][x]) {
      return undefined;
    }
    return internalGrid[y][x].element;
  };

  const update = (
    x: number,
    y: number,
    updater: (current: T | undefined) => T | undefined
  ) => {
    const current = get(x, y);
    set(x, y, updater(current));
  };

  const getAll = () =>
    Object.values(internalGrid).flatMap((row) => Object.values(row));

  // TODO: Kinda temporary to support old implementation of map, remove once deprecated
  const getRows = () =>
    Object.values(internalGrid).map((row) =>
      Object.values(row).map((cell) => cell.element)
    );

  const forEach = (action: CellAction<T>) => {
    for (const row of Object.values(internalGrid)) {
      for (const cell of Object.values(row)) {
        action(cell);
      }
    }
  };

  const find = (predicate: CellFilterPredicate<T>): T[] => {
    const result: T[] = [];
    forEach((cell) => {
      if (predicate(cell)) {
        result.push(cell.element);
      }
    });
    return result;
  };

  const map = <R>(transform: CellTransform<T, R>): R[] => {
    const result: R[] = [];
    forEach((cell) => {
      result.push(transform(cell));
    });
    return result;
  };

  const grid = {
    width,
    height,
    set,
    get,
    getAll,
    getRows,
    update,
    forEach,
    find,
    map,
  };

  return grid;
};

export type VirtualGrid<T> = {
  width: number;
  height: number;

  add: (x: number, y: number, element: T) => void;
  get: (x: number, y: number) => T[];
  getCells: () => VirtualGridCell<T>[];
};

type VirtualGridCell<T> = {
  x: number;
  y: number;
  cells: T[];
};

export const virtualGrid = <T>(
  width: number = 0,
  height: number = 0
): VirtualGrid<T> => {
  const internalGrid: Record<number, Record<number, VirtualGridCell<T>>> = {};

  const add = (x: number, y: number, ...elements: T[]) => {
    if (!internalGrid[y]) {
      internalGrid[y] = {};
    }
    if (!internalGrid[y][x]) {
      internalGrid[y][x] = { x, y, cells: [] };
    }
    internalGrid[y][x].cells.push(...elements);
  };

  const get = (x: number, y: number): T[] => {
    if (!internalGrid[y] || !internalGrid[y][x]) {
      return [];
    }
    return internalGrid[y][x].cells;
  };

  const getCells = () =>
    Object.values(internalGrid).flatMap((row) => Object.values(row));

  const grid = {
    width,
    height,
    add,
    get,
    getCells,
  };

  return grid;
};

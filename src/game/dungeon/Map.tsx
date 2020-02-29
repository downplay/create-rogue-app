import React, { memo, useContext } from "react";
import { Grid, Row, Cell } from "../../engine/grid";
import { useGrid } from "../../engine/RogueContext";

type MapCellProps = {
  cell: Cell;
};

const MapCell = memo(({ cell }: MapCellProps) => {
  return cell.tiles.map(s);
});

type MapRowProps = {
  row: Row;
};

const MapRow = memo(({ row }: MapRowProps) => {
  return row.map((cell, index) => <MapCell key={index} cell={cell}></MapCell>);
});

type MapProps = {
  grid: Grid;
};

export const Map = () => {
  const grid = useGrid();
  return grid.map.map((row, index) => <MapRow key={index} row={row} />);
};

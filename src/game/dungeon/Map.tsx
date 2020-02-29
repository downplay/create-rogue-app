import React, { memo, useContext } from "react";
import { GridContext } from "../../engine/RogueContext";
import { Grid } from "../../engine/grid";

type MapRowProps = {
  row: Row;
};

const MapRow = memo(({ row }: MapRowProps) => {});

type MapProps = {
  grid: Grid;
};

export const Map = () => {
  const grid = useContext(GridContext);
  return grid.map((row, index) => <MapRow key={index} row={row} />);
};

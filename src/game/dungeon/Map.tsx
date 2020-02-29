import React, { memo } from "react";
import { Row, Cell } from "../../engine/grid";
import { useGrid } from "../../engine/RogueContext";
import styled from "styled-components";
import { Line, Char } from "../../ui/Typography";

type MapCellProps = {
  cell: Cell;
};

const Layer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

const MapCell = memo(({ cell }: MapCellProps) => {
  return (
    <Char>
      {cell.tiles.map(({ TileComponent }) => (
        <Layer>
          <TileComponent />
        </Layer>
      ))}
    </Char>
  );
});

type MapRowProps = {
  row: Row;
};

const MapRow = memo(({ row }: MapRowProps) => {
  return (
    <Line>
      {row.map((cell, index) => (
        <MapCell key={index} cell={cell}></MapCell>
      ))}
    </Line>
  );
});

export const Map = () => {
  const grid = useGrid();
  return grid.map.map((row, index) => <MapRow key={index} row={row} />);
};

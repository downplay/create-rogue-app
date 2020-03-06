import React, { memo } from "react";
import { Row, Cell, useGridState } from "../../engine/grid";
import styled from "styled-components";
import { Line, Char, CHAR_WIDTH, CHAR_HEIGHT } from "../../ui/Typography";
import { Tile } from "../../engine/grid";

type MapCellProps = {
  cell: Cell;
};

const Layer = styled.span<Pick<Tile, "z">>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ z }) => z};
`;

const MapCell = memo(({ cell }: MapCellProps) => {
  return (
    <Char>
      {cell.tiles.map(({ TileComponent, z, id }, index) => (
        <Layer key={id} z={z}>
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

export const Map = memo(() => {
  const grid = useGridState();
  return (
    <>
      {grid.map.map((row, index) => (
        <MapRow key={index} row={row} />
      ))}
    </>
  );
});

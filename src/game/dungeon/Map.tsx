import React, { memo, useCallback } from "react";
import {
  Row,
  Cell,
  Tile,
  useGridState,
  GridLayers,
  ShowCardEventKey,
  HideCardEventKey
} from "../../engine/grid";
import styled from "styled-components";
import { Line, Char, CHAR_WIDTH, CHAR_HEIGHT } from "../../ui/Typography";

type MapCellProps = {
  cell: Cell;
};

const zIndexFromLayer = (layer: GridLayers) => {
  return Number(layer) * 10;
};

const Layer = styled.span<Pick<Tile, "layer">>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ layer }) => zIndexFromLayer(layer)};
`;

const MapCell = memo(({ cell }: MapCellProps) => {
  const handleMouseOver = useCallback(() => {
    for (const tile of cell.tiles) {
      tile.entity?.fireEvent(ShowCardEventKey);
    }
  }, [cell]);
  const handleMouseOut = useCallback(() => {
    for (const tile of cell.tiles) {
      tile.entity?.fireEvent(HideCardEventKey);
    }
  }, [cell]);

  return (
    <Char onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {cell.tiles.map(({ TileComponent, layer, id }) => (
        <Layer key={id} layer={layer}>
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

const PanZoom = styled.div`
  position: absolute;
`;

export const Map = memo(() => {
  const grid = useGridState();
  return (
    <PanZoom>
      {grid.map.map((row, index) => (
        <MapRow key={index} row={row} />
      ))}
    </PanZoom>
  );
});

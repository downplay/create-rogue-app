import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect
} from "react";
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
import { usePlayer } from "../../engine/player";
import {
  vector,
  Vector,
  VECTOR_ORIGIN,
  multiply,
  add
} from "../../engine/vector";
import { getPosition } from "../../engine/hasPosition";

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

type PanZoomProps = {
  pan: Vector;
};

const ViewPort = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const PanZoom = styled.div<PanZoomProps>(
  ({ pan: { x, y } }) => `
position: absolute;
transform: translate(${x}px,${y}px);
`
);

export const Map = memo(() => {
  const grid = useGridState();
  // Alternately could trigger focus from an entity in the grid or a cell, but, more
  // straightforward to do it like this really
  const player = usePlayer();
  const viewRef = useRef<HTMLDivElement>(null!);
  const [viewSize, setViewSize] = useState<Vector>();
  const focus = getPosition(player.current);
  const pan = useMemo(() => {
    if (!viewSize || !focus) {
      return VECTOR_ORIGIN;
    }
    return add(multiply(focus, -CHAR_WIDTH), multiply(viewSize, 0.5));
  }, [viewSize, focus]);

  useLayoutEffect(() => {
    const updateViewSize = () => {
      const rect = viewRef.current.getBoundingClientRect();
      setViewSize(vector(rect.width, rect.height));
    };
    updateViewSize();
    window.addEventListener("resize", updateViewSize);
    return () => {
      window.removeEventListener("resize", updateViewSize);
    };
  }, []);

  return (
    <ViewPort ref={viewRef}>
      <PanZoom pan={pan}>
        {grid.map.map((row, index) => (
          <MapRow key={index} row={row} />
        ))}
      </PanZoom>
    </ViewPort>
  );
});

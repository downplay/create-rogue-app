import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect
} from "react";
import {
  SeenCell,
  Tile,
  useGridState,
  GridLayers,
  ShowCardEventKey,
  HideCardEventKey,
  useGrid
} from "../../engine/grid";
import styled from "styled-components";
import { CHAR_WIDTH, CHAR_HEIGHT } from "../../ui/Typography";
import { usePlayer } from "../../engine/player";
import {
  vector,
  Vector,
  VECTOR_ORIGIN,
  multiply,
  add
} from "../../engine/vector";
import { getPosition, PositionProps } from "../../engine/hasPosition";

// TODO: Get this from combination of; global setting, biome (high outdoors (infinite?)), player effects, current tile (shade)
const LOS_DISTANCE = 5;

type MapCellProps = {
  cell: SeenCell;
};

const zIndexFromLayer = (layer: GridLayers) => {
  return Number(layer) * 10;
};

const MAX_DRAW_DISTANCE = 10;

const mapBetween = <T extends any>(
  items: T[],
  start: number,
  end: number,
  callback: (item: T, index: number) => JSX.Element
) => {
  const output = [];
  const endMin = Math.min(end, items.length - 1);
  for (let n = Math.max(0, start); n <= endMin; n++) {
    output.push(callback(items[n], n));
  }
  return output;
};

// const mapBetween = <T extends any>(
//   items: T[],
//   start: number,
//   end: number,
//   callback: (item: T, index: number) => JSX.Element
// ) => {
//   return items.map(callback);
// };

const Layer = styled.div<Pick<Tile, "layer">>`
  position: absolute;
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: ${({ layer }) => zIndexFromLayer(layer)};
`;

const CellOuter = styled.div<PositionProps>`
  position: absolute;
  left: ${({ position }) => position.x * CHAR_WIDTH}px;
  top: ${({ position }) => position.y * CHAR_HEIGHT}px;
`;

const MapCell = memo(({ cell }: MapCellProps) => {
  console.log(cell);
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
    <CellOuter
      position={cell.position}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {cell.tiles.map(({ TileComponent, layer, id }) => (
        <Layer key={id} layer={layer}>
          <TileComponent />
        </Layer>
      ))}
    </CellOuter>
  );
});

type MapRowProps = {
  row: SeenCell[];
  min: number;
  max: number;
};

const MapRow = memo(({ row, min, max }: MapRowProps) => {
  return (
    <>
      {mapBetween(row, min, max, (cell, index) => (
        <MapCell key={index} cell={cell}></MapCell>
      ))}
    </>
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

const PanZoom = styled.div<PanZoomProps>`
  position: absolute;
  transform: translate(${({ pan: { x, y } }) => `${x}px,${y}px`});
`;
/* left: ${({ pan }) => pan.x}px;
  top: ${({ pan }) => pan.y}px; */

export const Map = memo(() => {
  const grid = useGrid();
  const gridState = useGridState();
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

  // Every time map updates, we need to update the "seen" grid which is what will
  // actually be rendered
  // TODO: The map is getting fairly overloaded with functionality now, somehow
  // move this elsewhere / subcomponents?
  // TODO: Also this effect as well as many others could run a potentially silly number
  // of times when not much has changed
  useEffect(() => {
    // Important: seen and map must already be the same size
    let newGrid = gridState.seen;
    for (const row of gridState.seen) {
      let newRow = row;
      for (const cell of row) {
        const mapCell = gridState.map[cell.position.y][cell.position.x];
        if (cell.fromCell !== mapCell) {
          // TODO: Could optimise if multiple cells are being changed
          newRow = newRow.map(oldCell =>
            oldCell === cell
              ? { ...oldCell, tiles: mapCell.tiles, fromCell: mapCell }
              : oldCell
          );
        }
      }
      if (row !== newRow) {
        // TODO: Could optimise if multiple rows are being changed
        newGrid = newGrid.map(oldRow => (oldRow === row ? newRow : oldRow));
      }
    }
    if (newGrid !== gridState.seen) {
      grid.updateSeen(newGrid);
    }
  }, [gridState.map]);

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

  const minRow = (focus?.y || 0) - MAX_DRAW_DISTANCE;
  const maxRow = (focus?.y || 0) + MAX_DRAW_DISTANCE;
  const minCell = (focus?.x || 0) - MAX_DRAW_DISTANCE;
  const maxCell = (focus?.x || 0) + MAX_DRAW_DISTANCE;

  return (
    <ViewPort ref={viewRef}>
      <PanZoom pan={pan}>
        {mapBetween(gridState.seen, minRow, maxRow, (row, index) => (
          <MapRow key={index} row={row} min={minCell} max={maxCell} />
        ))}
      </PanZoom>
    </ViewPort>
  );
});

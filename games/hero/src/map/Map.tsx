import styled from "styled-components";
import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { SeenCell, Tile, GridLayers } from "../engine/grid";
import { CHAR_WIDTH, CHAR_HEIGHT, Char } from "../ui/Typography";
import { vector, Vector, VECTOR_ORIGIN, multiply, add } from "@hero/text";
import { Grid } from "../engine/grid";
import { PlayerState } from "../game/Player";
import { PositionState } from "../mechanics/hasPosition";
import { GameState } from "../engine/game";

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

const CellOuter = styled.div<PositionState>`
  position: absolute;
  left: ${({ position }) => position.x * CHAR_WIDTH}px;
  top: ${({ position }) => position.y * CHAR_HEIGHT}px;
`;

const MapCell = memo(({ cell }: MapCellProps) => {
  // TODO: Make this crap work. Prob much simpler now. Just raise a react handler and pass entity.
  const handleMouseOver = useCallback(() => {
    // for (const tile of cell.tiles) {
    //   tile.entity?.fireEvent(ShowCardEventKey);
    // }
  }, [cell]);
  const handleMouseOut = useCallback(() => {
    // for (const tile of cell.tiles) {
    //   tile.entity?.fireEvent(HideCardEventKey);
    // }
  }, [cell]);

  return (
    <CellOuter
      position={cell.position}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {cell.tiles.map(({ content: TileComponent, layer, id, state }) => {
        const tile =
          typeof TileComponent === "string" ? (
            <Char>${TileComponent}</Char>
          ) : (
            <TileComponent {...state} />
          );
        return (
          <Layer key={id} layer={layer}>
            {tile}
          </Layer>
        );
      })}
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

type MapProps = {
  map: Grid;
  player: PlayerState;
};

export const Map = ({ map, player }: MapProps) => {
  const viewRef = useRef<HTMLDivElement>(null!);
  const [viewSize, setViewSize] = useState<Vector>();
  // Alternately could trigger focus from the player entity and bubble upwards, simpler
  // to do it like this tho
  const focus = player.position;
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

  const minRow = (focus?.y || 0) - MAX_DRAW_DISTANCE;
  const maxRow = (focus?.y || 0) + MAX_DRAW_DISTANCE;
  const minCell = (focus?.x || 0) - MAX_DRAW_DISTANCE;
  const maxCell = (focus?.x || 0) + MAX_DRAW_DISTANCE;

  // TODO: 1. Get flattened list of cells, simplify the rendering, everything absolute
  //       2. A getQuad method on Grid?
  //       3. seen grid is not updated

  return (
    <ViewPort ref={viewRef}>
      <PanZoom pan={pan}>
        {mapBetween(map.seen.getRows(), minRow, maxRow, (row, index) => (
          <MapRow key={index} row={row} min={minCell} max={maxCell} />
        ))}
      </PanZoom>
    </ViewPort>
  );
};

import { text } from "herotext";
import { GameState } from "../engine/game";
import { GridLayers } from "../engine/grid";
import { PositionState } from "./hasPosition";

export type TileState<T extends {} = {}> = {
  tile: string | React.ComponentType<T>;
  tileGridHandle: string;
};

export const hasTile = <T extends {} = {}>(
  tile: string | React.ComponentType<T> = "",
  layer: GridLayers = GridLayers.Floor
) => text<GameState & PositionState & TileState & T>`
Tile:
${tile as string}

setup:~
$tile=$Tile
$createTile

onMove:~ ($to)
$removeTile
$createTile

destroy:~
$removeTile

createTile:
$tileHandle=${({ grid, position, tile }) => grid.addTile(position, tile, layer)}

removeTile:
${({ grid, tileGridHandle }) => grid.removeTile(tileGridHandle)}
`;

// export const tile = (glyph: string) => () => <Emoji>{glyph}</Emoji>;

export const hasAnimatedTile = (layer: GridLayers = GridLayers.Floor) => text`
onTurn:~
$tile=[]
`;

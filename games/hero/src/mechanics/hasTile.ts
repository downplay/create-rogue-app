import { text, Vector } from "herotext";
import { GameState } from "../engine/game";
import { GridLayers } from "../engine/grid";
import { PositionState } from "./hasPosition";

export type TileState<T extends {} = {}> = {
  tile: string | React.ComponentType<T>;
  tileGridHandle: string;
};

type CombinedState = GameState & PositionState & TileState;

export const hasTile = <T extends {} = {}>(
  tile: string | React.ComponentType<T> = "",
  layer: GridLayers = GridLayers.Floor
) => text<CombinedState & T>`
Tile:
${tile as string}

setup:~
$tile=$Tile
$createTile

onMove:~ ($to)
$removeTile
$createTile($to)

destroy:~
$removeTile

createTile($to?):
$tileHandle=${({ to, grid, position, tile }: CombinedState & { to?: Vector }) =>
  grid.addTile(to || position, tile, layer)}

removeTile:
${({ grid, tileGridHandle, position }) =>
  grid.removeTile(position, tileGridHandle)}
`;

// export const tile = (glyph: string) => () => <Emoji>{glyph}</Emoji>;

export const hasAnimatedTile = (layer: GridLayers = GridLayers.Floor) => text`
onTurn:~
$tile=[]
`;

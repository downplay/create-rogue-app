import { text, Vector, StoryInstance } from "herotext";
import { GridLayers } from "../engine/grid";
import { PositionState } from "./hasPosition";
import { EngineState, SelfState } from "../engine/types";
import { EntityState } from "../engine/entity";

export type TileState<T extends {} = {}> = {
  tile: string | React.ComponentType<T>;
  tileGridHandle: string;
};

// type CombinedState = EngineState & PositionState & TileState;

export const hasTile = <T extends EntityState>(
  tile: string | React.ComponentType<T> = "",
  layer: GridLayers = GridLayers.Floor
) => text<T & SelfState<T>>`
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

createTile: ($to?)
$tileHandle=${({
  to,
  engine,
  position,
  tile,
  self,
}: T & SelfState<T> & { to?: Vector }) =>
  // TODO: Should `self` be a param of context, and context becomes typed,
  // and can be extended with custom props that shouldn't really be considered state
  // but still need to be accessible from entity?
  // context
  engine.map.addTile(
    to || position,
    tile,
    self as StoryInstance<EntityState>,
    layer
  )}

removeTile:
${({ engine, tileGridHandle, position }) =>
  engine.map.removeTile(position, tileGridHandle)}
`;

// export const tile = (glyph: string) => () => <Emoji>{glyph}</Emoji>;

export const hasAnimatedTile = (layer: GridLayers = GridLayers.Floor) => text`
onTurn:~
$tile=[]
`;

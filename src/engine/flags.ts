import { useEntity } from "./useEntitiesState";

type FlagProps = {
  on: symbol | string;
};

export const FLAG_PLAYER = Symbol("PlayerFlag");
export const FLAG_MONSTER = Symbol("MonsterFlag");
export const FLAG_SOLID = Symbol("SolidFlag");
export const FLAG_SPAWN = Symbol("SpawnFlag");
export const FLAG_PLAYER_SPAWN = Symbol("PlayerSpawnFlag");

export const hasFlag = (flag: symbol | string, value?: boolean) => {
  const entity = useEntity();
  entity.setFlag(flag, value);
};

export const isPlayer = () => hasFlag(FLAG_PLAYER);
export const isMonster = () => hasFlag(FLAG_MONSTER);
export const isSolid = () => hasFlag(FLAG_SOLID);
export const isSpawn = () => hasFlag(FLAG_SPAWN);
export const isPlayerSpawn = () => hasFlag(FLAG_PLAYER_SPAWN);

export const Spawn = () => {
  isSpawn();
  return null;
};

export const PlayerSpawn = () => {
  isPlayerSpawn();
  return null;
};

export const Flag = ({ on }: FlagProps) => {
  hasFlag(on);
  return null;
};

import { useEntity } from "./useEntitiesState";

export const FLAG_PLAYER = Symbol("PlayerFlag");
export const FLAG_MONSTER = Symbol("MonsterFlag");
export const FLAG_SOLID = Symbol("SolidFlag");
export const FLAG_SPAWN_POSITION = Symbol("SpawnPositionFlag");

export const hasFlag = (flag: symbol | string, value?: boolean) => {
  const entity = useEntity();
  entity.setFlag(flag, value);
};

export const isPlayer = () => hasFlag(FLAG_PLAYER);
export const isMonster = () => hasFlag(FLAG_MONSTER);
export const isSolid = () => hasFlag(FLAG_SOLID);
export const isSpawnPosition = () => hasFlag(FLAG_SPAWN_POSITION);

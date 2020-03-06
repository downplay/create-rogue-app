import { useEntity } from "./useEntitiesState";

export const SOLID_FLAG = Symbol("Solid");
export const SPAWN_POSITION_FLAG = Symbol("SpawnPosition");

export const hasFlag = (flag: symbol | string, value?: boolean) => {
  const entity = useEntity();
  entity.setFlag(flag, value);
};

export const isSolid = () => hasFlag(SOLID_FLAG);
export const isSpawnPosition = () => hasFlag(SPAWN_POSITION_FLAG);

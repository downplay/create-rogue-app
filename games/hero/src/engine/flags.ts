import { text, StoryInstance } from "@hero/text";

export const FLAG_PLAYER = "PlayerFlag";
export const FLAG_MONSTER = "MonsterFlag";
export const FLAG_SOLID = "SolidFlag";
export const FLAG_SPAWN = "SpawnFlag";
export const FLAG_PLAYER_SPAWN = "PlayerSpawnFlag";

export type FlagsState = {
  flags: string[];
};

type HasFlagProps = FlagsState & { flag: string; on: boolean };

const removeFlag = (flags: string[], flag: string) => {
  const index = flags.indexOf(flag);
  if (index >= 0) {
    flags.splice(index, 1);
  }
};

export const hasFlags = () => text<HasFlagProps>`
setup:+~
$flags=${[]}

setFlag: ($flag, $on?)
${({ flag, flags, on = true }) => {
  if (on) {
    flags.push(flag);
  } else {
    removeFlag(flags, flag);
  }
}}
`;

export const hasFlag = (flag: string, value?: boolean) => text<HasFlagProps>`
setup:+~
$setFlag(${flag})
`;

export const entityHasFlag = (
  instance: StoryInstance<FlagsState>,
  flag: string
) => {
  return (
    instance.globalScope.flags && instance.globalScope.flags.includes(flag)
  );
};

export const isPlayer = hasFlag(FLAG_PLAYER);
export const isMonster = hasFlag(FLAG_MONSTER);
export const isSolid = hasFlag(FLAG_SOLID);
export const isSpawn = hasFlag(FLAG_SPAWN);
export const isPlayerSpawn = hasFlag(FLAG_PLAYER_SPAWN);

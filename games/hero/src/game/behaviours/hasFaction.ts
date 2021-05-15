import { text } from "@hero/text";
export enum Factions {
  // Player themselves, and allies
  Player,
  // Typical monster, will go after player
  Monster,
  // Shopkeepers and quest givers, not targetted
  NPC,
  // In faction by themselves, will go after anyone
  Self,
}

export type FactionState = {
  faction: Factions;
};

export const hasFaction = (faction: Factions) => text<FactionState>`
faction:=
${faction}
`;

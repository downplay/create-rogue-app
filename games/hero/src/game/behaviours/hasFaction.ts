import { useEntityState } from "../../engine/useEntityState";
export enum Factions {
  // Player themselves, and allies
  Player,
  // Typical monster, will go after player
  Monster,
  // Shopkeepers and quest givers, not targetted
  NPC,
  // In faction by themselves, will go after anyone
  Self
}

const FactionStateKey = Symbol("Faction");

export const hasFaction = (faction: Factions) =>
  useEntityState<Factions>(FactionStateKey, faction);

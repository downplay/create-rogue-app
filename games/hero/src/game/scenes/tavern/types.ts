import { Vector } from "@hero/text";

export const TavernStateKey = Symbol("TavernScene");

export type TavernState = {
  scene: TavernScene;
  type: TavernType;
  size: Vector;
  door: Vector;
  name: string;
  spawn?: Vector;
};

export enum TavernScene {
  Exterior,
  Interior,
}

export enum TavernType {
  Brawl,
  Rest,
}

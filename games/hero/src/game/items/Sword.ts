import { GridLayers } from "../../engine/grid";
import { text, StoryInstance } from "herotext";
import { hasTile } from "../../mechanics/hasTile";

export type SwordState = {
  material: string;
  class: string;
  blade: string;
  size: number;
};

type HitEffect = {
  type: string; // Type unneccesary?
  effect: StoryInstance;
};

export type OnHitState = {
  actor: StoryInstance;
  target: StoryInstance;
  weapon: StoryInstance;
  hit: {
    power: number;
    accuracy: number;
    piercing: number;
    criticalMultiplier: number;
    criticalChance: number;
    effects: HitEffect[];
  };
};

/**
 * A generic sword
 */
export const Sword = text<SwordState>`
You see $a($name).

${hasTile("†", GridLayers.Item)}

Type:
Sword

Name:
$material $blade

Description:
A $size $class $material $blade.

blade:=
sword
rapier

class:=

toughness:=
10


material:=
[]wooden
[]bronze
[]iron
[]steel
[]diamond$null(%toughness=100)
[]glass
[=gold]golden

size:=
[1%,~0.01]tiny
[10%,~0.1]small
[50%,~1]
[10%,~10]large
[1%,~100]massive
`;

import { Vector } from "@hero/math";
import { useRng } from "../hooks/useRng";
import { RatScene } from "./scenes/RatScene";

// const asMemo = <T>(op: () => T): T => {
//   const context = withContext();
// };

type WorldMapPath = {
  start: WorldMapNode;
  end: WorldMapNode;
};

type WorldMapNode = {
  type: string;
  paths: WorldMapPath[];
  position: Vector;
};

const GameData = defineData<{}>("Game");

export const Game = defineEntity(() => {
  const [game, updateGame] = hasData(GameData);
  const [party, updateParty] = hasData("Game_Party");
  const rng = getRng();

  //   const map = asMemo(() => {
  //     const startNode = mapNode({
  //       type: "start",
  //       scene: StartScene,
  //     });
  //   });

  const spawner = hasSpawner();

  const nextEncounter = () => {
    const encounter = RatScene;
  };
});

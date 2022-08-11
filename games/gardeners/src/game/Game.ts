import { Vector } from "@hero/math"
import { onCreate } from "../engine/action"
import { defineData, hasData } from "../engine/data"
import { defineEntity, getEngine, getSelf } from "../engine/entity"
import { hasChildren } from "../engine/hasChildren"
import { withCanvas } from "../with-three/GameCanvas"
import { withSprite } from "../with-three/withSprite"
import { RatScene } from "./scenes/RatScene"

// const asMemo = <T>(op: () => T): T => {
//   const context = withContext();
// };

type WorldMapPath = {
    start: WorldMapNode
    end: WorldMapNode
}

type WorldMapNode = {
    type: string
    paths: WorldMapPath[]
    position: Vector
}

export type GameState = {
    day: number
}

const GameData = defineData<GameState>("Game")

export const Game = defineEntity("Game", () => {
    const [game, updateGame] = hasData(GameData, () => ({ day: 1 }))

    withCanvas({ name: "game", slot: "board" })

    const { add, remove } = hasChildren()
    const engine = getEngine()
    onCreate(() => {
        add(engine.entities.create(RatScene, {}))
    })
    // const [party, updateParty] = hasData("Game_Party")
    // const rng = withRng()
    //   const map = asMemo(() => {
    //     const startNode = mapNode({
    //       type: "start",
    //       scene: StartScene,
    //     });
    //   });
    // const spawner = hasSpawner()
    // const nextEncounter = () => {
    //     const encounter = RatScene
    // }
})

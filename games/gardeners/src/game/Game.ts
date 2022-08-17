import { Vector } from "@hero/math"
import { onCreate } from "../engine/action"
import { defineData, hasData } from "../engine/data"
import { defineEntity, getEngine, getSelf } from "../engine/entity"
import { hasChildren } from "../engine/hasChildren"
import { onSceneCreate, withCanvas } from "../with-three/GameCanvas"
import { withSprite } from "../with-three/withSprite"
import { RatScene } from "./scenes/RatScene"
import { WizardScene } from "./scenes/wizard/WizardScene"

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

    /*const { camera } = */ withCanvas({ name: "game", slot: "board" })

    const { add, remove } = hasChildren()
    const engine = getEngine()
    onCreate(() => {
        const scene = engine.entities.create(WizardScene, {})
        // add(engine.entities.create(RatScene, {}))
        add(scene)
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

import { text } from "@hero/text"
import { BufferGeometry, Line, LineBasicMaterial, SplineCurve, Vector2 } from "three"
import { onUpdate } from "../../engine/action"
import { defineEntity, getEngine } from "../../engine/entity"
import { hasStory } from "../../engine/hasStory"
import { onSceneCreate, onSceneDestroy, onSceneRender } from "../../with-three/GameCanvas"
import { withSprite } from "../../with-three/withSprite"
import { hasClock } from "../mechanics/hasClock"
import { hasPosition } from "../mechanics/hasPosition"

import RatSprite from "./rat.png"

// const Disease = defineMod("Disease", () => {
//     const rng = hasRng()
//     const parent = getModTarget()
//     const me = getSelf()
//     const [current, setAlarm] = hasClock(() => {
//         me.destroy()
//     })
//     const [time, updateTime] = hasData("Time", () => rng.range(3, 10))
//     setAlarm(current + time)

//     onCreate(() => {
//         modifyEntity(parent, () => {
//             mutateStats(({ body, spirit }) => ({ body: body - 1, spirit: spirit - 1 }))
//         })
//     })
// })

// const Rat = defineEntity("Rat", () => {
//   hasStats({ mind: 3, body: 2, spirit: 0 });

//   hasAttack("Gnaw", {});
//   hasAttack("Scratch", {});
//   // hasMovement("000010111")

//   asAction("giveDisease", (target) => ({
//     target.addMod(Disease)
//   }));

//   hasStory(text`
// Attack_Gnaw($target,$damage): The rat gnaws on $target with its smelly teeth.$maybeDisease($target)

// maybeDisease($target):
// [33%] The wound festers, and you feel sick in your stomach.$giveDisease($target)
//   `);
// });

// export const RatBattle = () => {
//     const rng = useRng()
//     const numRats = rng.range(3, 10)
//     hasStory(text`
// Rats appear from all directions!
//   `)
// }

export const RatMan = defineEntity("RatMan", () => {})

type SplineProps = {
    speed?: number
}

const withSplineMovement = ({ speed = 1 }: SplineProps = {}) => {
    const engine = getEngine()
    const clock = hasClock()
    const [, setPosition] = hasPosition()
    // TODO: We only want to trigger the anim occasionally, and pick from a
    // few different random ones; maybe even randomize the splinecurve itself.
    // Need whole systems for this, and maybe even move it into story?
    const curve = new SplineCurve([
        new Vector2(0, 0),
        new Vector2(0.1, 0.3),
        new Vector2(0.2, 0),
        new Vector2(0, 0.4),
        new Vector2(-0.2, 0),
        new Vector2(-0.1, 0.3),
        new Vector2(0, 0)
    ])
    let splineObject: Line

    onSceneCreate(({ scene }) => {
        if (engine.debug) {
            const points = curve.getPoints(50)
            const geometry = new BufferGeometry().setFromPoints(points)

            const material = new LineBasicMaterial({ color: 0xff0000 })

            // Create the final object to add to the scene
            splineObject = new Line(geometry, material)
            scene.add(splineObject)
        }
    })

    onSceneDestroy(({ scene }) => {
        scene.remove(splineObject)
    })

    onSceneRender(() => {
        const position = curve.getPoint((clock.value.time * speed) % 1)
        // TODO: Needs an additional positioning node
        setPosition(position.x, position.y, 0)
    })
}

export const RatScene = defineEntity("RatScene", () => {
    withSprite(RatSprite)
    withSplineMovement({ speed: 0.5 })
    // TODO:
    // - Scene() or isScene() ?
    // - next scene action
    // - Terminal instanced here or globally?
    // const { next } = isScene("Rat")
    // const [rat, destroyRat] = hasEntity("Rat1", Rat)
    // Outcomes:
    // - gain pet rat
    // - gain cheese
    // - gain rat trap
    // - fight rat(s)
    // - give cheese to get random jump
    hasStory(
        text`
Hi folks I'm the ratman!$test

test:
one
two
three

onSetup:
Boo
    `,
        {}
    )
})

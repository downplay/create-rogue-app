import { text } from "@hero/text"
import { defineEntity } from "../../engine/entity"
import { hasStory } from "../../engine/hasStory"
import { withSprite } from "../../with-three/withSprite"

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

export const RatScene = defineEntity("RatScene", () => {
    withSprite(RatSprite)
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

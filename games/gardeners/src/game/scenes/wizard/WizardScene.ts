import { map } from "@hero/map"
import { text } from "@hero/text"
import { defineEntity } from "../../../engine/entity"
import { hasMap } from "../../../engine/hasMap"
import { hasStory } from "../../../engine/hasStory"
import { wait } from "../../../executors/wait"
import { hasLight } from "../../../with-three/hasLight"
import { withSprite } from "../../../with-three/withSprite"
import { Grass } from "../../scenery/Grass"
import { Road } from "../../scenery/Road"
import wizardSprite from "./wizard.png"

const BushWizard = defineEntity("BushWizard", () => {
    withSprite(wizardSprite)
})

export const WizardScene = defineEntity("WizardScene", () => {
    // TODO: Have the wizard actually hiding in a bush
    // TODO: Use outputs of the randomised texts to define the scene, e.g. different
    // types of road tile and different variants of wizard. Or do it the other way around
    // and let outputs of the map generation influence the text. Aagh also tricky!!!
    hasStory(text`[
By the side of the [road|path|track] you see a [bush|shrub|quviering plant].${wait(2000)}
Suddenly a [wizened old|sprightly|jittery] [wizard|mage|druid] jumps out!
They offer you a selection of items:
$items
]

items:+
one
two
three

`)

    // TODO: Group together light, skybox etc. for different daytimes/biomes
    hasLight()

    hasMap(map`
..........
..........
....w.....
..........
==========
==========
==========
..........
..........
..........
..........

[.w] = ${Grass}
= = ${Road}
w = ${BushWizard}
`)
})

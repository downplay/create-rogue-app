import { text } from "@hero/text"
import { defineEntity } from "../../engine/entity"
import { hasStory } from "../../engine/hasStory"

type SwordStory = {
    weight: number
    damage: number
    fragile: boolean
}

export const Sword = defineEntity("Sword", () => {
    const { weight, damage, fragile } = hasStory<SwordStory>(text`
description:
A $materialAdjective $class
onSetup:

materialAdjective: ($material)
{wood}wooden
{iron}ironic
{glass}glassy

color:
{wood}<1,0.8,0.2>
{iron}<0.5,0.5,0.6>
{glass}<1,0.8,0.2,0.5>

weight:
{wood}<1>
{iron}<2>
{glass}<1.5>

fragile:
{glass}<true>
{}<false>

wood:+
$weight=1
$color=<1,0.8,0.2>

class:=
sword
dagger
greatsword
`)
    return { weight, damage, fragile }
})

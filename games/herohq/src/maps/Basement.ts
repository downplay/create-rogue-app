import { map } from "@hero/map"

import { defineActor } from "../model/actor"
import { MapExternals, defineMap } from "./map"

const MicroBug = defineActor("MicroBug", [])

export const BasementMap = defineMap(
    "Basement",
    // TODO: How to make map's type auto resolve (maybe define a proxy map``? shame tho...)
    map<MapExternals>`
###########
#,3,,,,,3,#
#,.2.>.2.,#
#,>.1.1.>,#
#,...!...,#
#,>.1.1.>,#
#,.2.>.2.,#
#,3,,,,,3,#
###########

Floor = ${({ rng }) => rng.un}
[123] = #
123 = .
3  = ,
.> = Floor
>  = (UpStairs:1) | (UpStairs:2)
#  = Wall
., = MicroBug:1/10
,  = WallTorch:1/5
`
)

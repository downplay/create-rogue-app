import { defineData, defineModule } from "./actor"

export const LevelData = defineData("Level", 1)

const LevelUpgradeModule = defineModule<{}, { level: number; upgradeCost: number }>(
    "LevelUpgrade",
    ({}, { get }) => {
        const level = get(LevelData)
        return {
            level,
            upgradeCost: Math.pow(2, level) * 10
        }
    }
)

// const GainXPAction = defineAction("GainXP")
// const GainLevelAction = defineAction("GainLevel")

// const LevelModule = defineModule("Level", ({update,action})=>{
//         action(GainXPAction, ()=>{

//         })
// })

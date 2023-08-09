import { BugMonster } from "./bug"
import { MonsterDefinition } from "./definitions"

export const monsters = [BugMonster]
export const monsterMap = monsters.reduce((acc, next) => {
    acc[next.type] = next
    return acc
}, {} as Record<string, MonsterDefinition>)

export const definitionForMonster = (type: string) => {
    if (!monsterMap[type]) {
        throw new Error("Unknown monster type: " + type)
    }
    return monsterMap[type]
}

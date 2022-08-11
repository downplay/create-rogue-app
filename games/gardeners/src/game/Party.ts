import { onCreate } from "../engine/action"
import { defineData, hasData } from "../engine/data"
import { defineEntity } from "../engine/entity"
import { EntityInstance, EntityType } from "../engine/types"

type ChipEntityExternal = {
    canApplyTo: (target: EntityInstance) => boolean
    applyTo: (target: EntityInstance) => void | EntityInstance
}

type ChipData = {
    type: string
    entity: EntityType<any, ChipEntityExternal>
}

type PartyData = {
    stack: ChipData[]
}

const PartyDataDef = defineData<PartyData>("Party")

const Party = defineEntity("Party", () => {
    const [data, updateData] = hasData(PartyDataDef, () => ({ stack: [] }))
    onCreate(() => {
        // Initialize stack with some test items
    })
})

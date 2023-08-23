import { ComponentType, PropsWithChildren } from "react"
import { defineData, defineModule } from "../../model/actor"

export type PhysicsWrapperProps = PropsWithChildren<{}>

type PhysicsModuleOpts = {
    wrapper: ComponentType<PropsWithChildren<{}>>
}

// TODO: How should we corpsify a human? We could send an action to enable/disable physics then setup
// the ragdoll via the wrapper.

const PhysicsData = defineData("Physics", { enabled: false })

export const PhysicsModule = defineModule<PhysicsModuleOpts>("Physics", ({ wrapper }) => {
    return {
        wrapper
    }
})

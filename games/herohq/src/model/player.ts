// TODO: This is a placeholder anywhere we need to refer to current player (e.g. as
// owner of a hero). Once we have concept of multiple players we need to swap this

import { Vector3 } from "three"
import { defineAction } from "./actor"

// for proper atom read.
export const PLAYER_ID = "me"

export const InteractionAction = defineAction<{
    interactor: string
    point: Vector3
    mode: "perform" | "previewOn" | "previewOff"
}>("Interaction")

// A general "cancel what you're currently" action
export const CancelAction = defineAction("Cancel")

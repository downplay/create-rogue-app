import { defineModule } from "./actor"
import { AttackTargetAction } from "./fight"
import { CancelAction, InteractionAction } from "./player"

export const EnemyModule = defineModule(
    "Enemy",
    () => {},
    ({}, { id, handle, dispatch }) => {
        handle(InteractionAction, ({ interactor, mode, point }) => {
            switch (mode) {
                case "perform":
                    dispatch(CancelAction, undefined, interactor)
                    dispatch(AttackTargetAction, { target: id }, interactor)
                    break
                case "previewOn":
                case "previewOff":
                    // TODO: What we should do is change the user's cursor to a crosshair,
                    // display a red outline, display a red path on the ground, display popup
                    // of monster health/stats, etc etc etc
                    break
            }
        })
    }
)

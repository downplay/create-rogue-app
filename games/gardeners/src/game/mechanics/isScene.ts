import { withCanvas } from "../../with-three/GameCanvas"

export const isScene = () => {
    withCanvas({ name: "scene", slot: "board" })
}

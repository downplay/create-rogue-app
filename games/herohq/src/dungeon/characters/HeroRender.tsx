import { ActorProps } from "../../model/actor"
import { HumanRender } from "./HumanRender"
export const HeroRender = ({ id, mode }: ActorProps) => {
    return <HumanRender mode={mode} id={id} />
}

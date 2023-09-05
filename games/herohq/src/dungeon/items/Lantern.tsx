import { useMemo, useRef } from "react"
import { Position, Rod } from "../../3d/Parts"
import { Euler, Vector3 } from "three"
import { RenderModule, defineActor, ActorProps } from "../../model/actor"
import { ItemModule } from "../../model/item"
import { EquipmentModule } from "../../model/equip"
import { makeMetalMaterial, makeToonMaterial } from "../../3d/materials"
import { Chain } from "../geometry/Chain"
import { RigidBody } from "@react-three/rapier"

const LANTERN_LENGTH = 0.8

const LIGHT_POSITION = new Vector3(0, 0, LANTERN_LENGTH / 2)
const END_CAP_POSITION = new Vector3(0, 0, LANTERN_LENGTH)

const ORIENT_UPSIDE = new Euler(Math.PI, 0, 0)

// const material = makeMetalMaterial([0.49, 0.208, 0.403])

const material = makeMetalMaterial([0.25, 0.208, 0.403])
// const material = makeToonMaterial(0.49, 0.208, 0.403)

const Lantern = ({ physics }: { physics?: boolean } & ActorProps) => {
    const radialStruts = 5
    const endRef = useRef(null)
    const radials = useMemo(() => {
        const output = []
        for (let n = 0; n < radialStruts; n++) {
            output.push(
                <Position key={n} at={new Vector3(0.24, (2 * n) / radialStruts, 0)}>
                    <Rod length={LANTERN_LENGTH} caps={0.02} material={material} />
                </Position>
            )
        }
        return output
    }, [radialStruts])

    const body = (
        <Rod debug caps={0.5} length={0.02} material={material}>
            <Position at={LIGHT_POSITION}>
                <pointLight
                    color="white"
                    castShadow
                    shadow-camera-near={0.1}
                    shadow-camera-far={100}
                    intensity={3}
                    decay={1}
                    // TODO: Distance can increase based on lighting type and player stats
                    // Maybe player gets a default pointlight for their eye strength?
                    distance={20}
                />
            </Position>
            <Position at={END_CAP_POSITION}>
                <Rod debug caps={0.5} length={0.02} material={material} />
            </Position>
            {radials}
        </Rod>
    )

    return (
        <Chain
            links={4}
            length={0.3}
            width={0.06}
            material={material}
            physics={physics}
            endRef={endRef}>
            {physics ? <RigidBody ref={endRef}>{body}</RigidBody> : body}
        </Chain>
    )
}

const LanternRenderThumb = ({ id, mode }: ActorProps) => {
    return (
        <group scale={1} position={[0, 1, 0]} rotation={ORIENT_UPSIDE}>
            <Lantern id={id} mode={mode} />
        </group>
    )
}

const LanternRenderWorld = ({ id, mode }: ActorProps) => {
    return (
        <group scale={0.5} position={[0, 0, 0]} rotation={ORIENT_UPSIDE}>
            {/* <group scale={0.2}> */}
            <Lantern id={id} mode={mode} physics />
        </group>
    )
}

const LanternRenderEquip = ({ id, mode }: ActorProps) => {
    return (
        <group scale={0.3} position={[0, 0, 0]}>
            {/* <group scale={0.2}> */}
            <Lantern id={id} mode={mode} physics />
        </group>
    )
}

const LanternRender = ({ id, mode }: ActorProps) =>
    mode === "thumbnail" ? (
        <LanternRenderThumb id={id} mode={mode} />
    ) : mode === "equip" ? (
        <LanternRenderEquip id={id} mode={mode} />
    ) : (
        <LanternRenderWorld id={id} mode={mode} />
    )

export const LanternItem = defineActor("Lantern", [
    [RenderModule, { renderer: LanternRender }],
    [ItemModule, { stackable: false }],
    [
        EquipmentModule,
        {
            // TODO: This schema doesn't quite allow for if we want something to behave
            // differently in a different slot.
            slot: ["left", "right"],
            // requirements: [{type:"level", minimum: 10}],
            effects: [
                {
                    type: "attack",
                    // Attacks should be defined in a defineAttack(...) kind of way
                    // and add a bunch more things like how to calculate the final power
                    // from the weapon level, its material etc.
                    attack: {
                        type: "flail",
                        length: 10,
                        activate: 2,
                        power: 2
                        // TODO: Add some burn effect
                    }
                }
            ]
        }
    ]
])

import { forwardRef, useMemo, useRef } from "react"
import { Ball, CollisionGroups, ORIGIN, Position, Rod } from "../../3d/Parts"
import { Euler, Vector3 } from "three"
import { RenderModule, defineActor, ActorProps } from "../../model/actor"
import { ItemModule } from "../../model/item"
import { EquipActorProps, EquipmentModule } from "../../model/equip"
import { makeMetalMaterial, makeToonMaterial } from "../../3d/materials"
import { Chain } from "../geometry/Chain"
import {
    RapierRigidBody,
    RigidBody,
    interactionGroups,
    useFixedJoint,
    useSphericalJoint
} from "@react-three/rapier"
import { PhysicsActor } from "../Actor"

const LANTERN_LENGTH = 0.8

const LIGHT_POSITION = new Vector3(0, 0, LANTERN_LENGTH / 2)
const END_CAP_POSITION = new Vector3(0, 0, LANTERN_LENGTH)

const ORIENT_UPSIDE = new Euler(Math.PI, 0, 0)

// const material = makeMetalMaterial([0.49, 0.208, 0.403])

const material = makeMetalMaterial([0.25, 0.208, 0.403])
// const material = makeToonMaterial(0.49, 0.208, 0.403)

const CHAIN_WIDTH = 0.03
const BAR_WIDTH = 0.05
const BODY_WIDTH = 0.5

const Lantern = forwardRef(({ physics }: { physics?: boolean } & ActorProps, ref) => {
    const radialStruts = 5
    const endRef = useRef(null)
    const radials = useMemo(() => {
        const output = []
        for (let n = 0; n < radialStruts; n++) {
            output.push(
                <Position key={n} at={new Vector3(0.22, (2 * n) / radialStruts, 0)}>
                    <Rod length={LANTERN_LENGTH} caps={BAR_WIDTH} material={material} />
                </Position>
            )
        }
        return output
    }, [radialStruts])

    const body = (
        <group scale={0.2}>
            <Rod caps={BODY_WIDTH} length={BAR_WIDTH} material={material}>
                <Position at={LIGHT_POSITION}>
                    <pointLight
                        color="white"
                        castShadow
                        shadow-camera-near={0.01}
                        shadow-camera-far={100}
                        intensity={3}
                        decay={1}
                        // TODO: Distance can increase based on lighting type and player stats
                        // Maybe player gets a default pointlight for their eye strength?
                        distance={20}
                    />
                </Position>
                <Position at={END_CAP_POSITION}>
                    <Rod caps={BODY_WIDTH} length={BAR_WIDTH} material={material} />
                </Position>
                {radials}
            </Rod>
        </group>
    )

    return (
        <Chain
            ref={ref}
            links={4}
            length={0.3}
            width={CHAIN_WIDTH}
            material={material}
            physics={physics}
            endRef={endRef}>
            {physics ? (
                <RigidBody
                    ref={endRef}
                    collisionGroups={interactionGroups(0, [])}
                    linearDamping={0.8}
                    angularDamping={0.8}>
                    {body}
                </RigidBody>
            ) : (
                body
            )}
        </Chain>
    )
})

const LanternRenderThumb = ({ id, mode }: ActorProps) => {
    return (
        <group scale={2} position={[0, 1, 0]} rotation={ORIENT_UPSIDE}>
            <Lantern id={id} mode={mode} />
        </group>
    )
}

const LanternRenderWorld = ({ id, mode }: ActorProps) => {
    const bodyRef = useRef<RapierRigidBody>(null)

    return (
        <PhysicsActor id={id} bodyRef={bodyRef} position={[0, 0.5, 0]} rotation={ORIENT_UPSIDE}>
            {/* <group scale={0.2}> */}
            <Lantern ref={bodyRef} id={id} mode={mode} physics />
        </PhysicsActor>
    )
}

const LanternRenderEquip = ({ id, handleRef }: EquipActorProps) => {
    const bodyRef = useRef<RapierRigidBody>(null)

    // const joint = useFixedJoint(aRef, bRef, [
    //     [0, 0, 0],
    //     [0, 0, 0, 1],
    //     [0, 0, 0],
    //     [0, 0, 0, 1]
    // ])

    const joint = useFixedJoint(handleRef, bodyRef, [
        [0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 0],
        [0, 0, 0, 1]
    ])

    return (
        <>
            {/* <RigidBody
                type="kinematicPosition"
                ref={aRef}
                collisionGroups={interactionGroups(CollisionGroups.rope, [])}>
                <Ball size={0.05} material={material} />
            </RigidBody> */}
            {/* <group scale={0.3} position={ORIGIN}> */}
            {/* <group scale={0.2}> */}

            <Lantern id={id} ref={bodyRef} mode="equip" physics />
            {/* </group> */}
        </>
    )
}

const LanternRender = ({ id, mode }: ActorProps) =>
    mode === "thumbnail" ? (
        <LanternRenderThumb id={id} mode={mode} />
    ) : (
        <LanternRenderWorld id={id} mode={mode} />
    )

const LanternFurnitureRender = ({ id, mode }: ActorProps) => {}

export const LanternItem = defineActor("Lantern", [
    [RenderModule, { renderer: LanternRender }],
    [ItemModule, { stackable: false }],
    [
        EquipmentModule,
        {
            renderer: LanternRenderEquip,
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

export const LanternFurniture = defineActor("LanternFurniture", [])

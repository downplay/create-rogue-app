import { useMemo } from "react"
import { useAtomValue } from "jotai"
import { Ball, Direction, Position, Rod } from "../../3d/Parts"
import { Euler } from "three"
import { ActorProps, gameTimeTicksAtom } from "../../model/actor"

// TODO: Some advanced bugs might have different numbers of legs
const LEG_PAIRS_COUNT = 24
const LEG_CYCLE_SPEED = 1
const LEG_SIDE_AMOUNT = 0.08

const ORIENT_FORWARDS = new Euler(-0.5 * Math.PI, 0, 0)

// TODO: It's not at all working in the way hoped or as horrific as required.
// Should be more like a series of bug bodies strung together.

export const PedeRender = ({ id }: ActorProps) => {
    const time = useAtomValue(gameTimeTicksAtom)
    const legs = useMemo(() => {
        let legs = []
        for (let n = 0; n < LEG_PAIRS_COUNT; n++) {
            // TODO: We can make a resonable approximation here but the better aim would be to do
            // some inverse kinematics, or possibly just track the position of each foot ourselves;
            // while food is grounded adjust knee to keep consistent leg length, then other half
            // of the cycle the foot is moving to the next target. Might just be a lot of processor
            // work to do all of this tho!
            for (let m = 0; m < 2; m++) {
                const left = m % 2 === 0
                // TODO: It's sort of accidental that opposite legs are opposite time because of the
                // rotation direction. We should have a slightly more sophisticated leg sequencing because
                // it doesn't look quite natural rn
                const cycle = n / LEG_PAIRS_COUNT + +time * LEG_CYCLE_SPEED
                const side = Math.cos(cycle * 2 * Math.PI) * LEG_SIDE_AMOUNT
                // Only taking half of the cycle for lift
                const lift = Math.max(0, Math.sin((cycle + (!left ? 0 : 0.5)) * 2 * Math.PI))
                // TODO: It'd be great to play with these figures all day but it's good for now.
                // Would be nice to get body bobbing up and down.
                const incline = 0.68 + lift * 0.4
                const inflex = -0.9 - lift * 0.3
                // if (left) {
                legs.push({
                    // TODO: We'll also want to be able to refer to limbs by some kind of Id so they
                    // can e.g. wield weapons, wear jewellery
                    index: (left ? "L" : "R") + (n + 1),
                    position: [
                        ((n + 1) / (LEG_PAIRS_COUNT + 1)) * 0.5 + (left ? -0.75 : 0.25),
                        -0.2,
                        0
                    ] as const,
                    // TODO: We should be more efficient with the time-based
                    // properties and only be updating the rotations over time
                    // rahter than regenerating the whole legs list
                    rotate: [side, incline, 0] as Direction,
                    knee: [0, inflex, 0] as Direction
                })
                // }
            }
        }
        return legs
    }, [time])
    // TODO: Loads of detail like facial features, feet, knee ball. Let's get this working first
    // tho.
    return (
        <group rotation={ORIENT_FORWARDS} position={[0, 2.5, 0]}>
            <Rod length={10} caps={2}>
                {legs.map((l) => (
                    <Position key={l.index} at={l.position}>
                        {/* // TODO: For memoisation of vector calcs, make these param arrays
                    // memoised as well (or static) */}
                        <Rod length={3} caps={0.1} rotate={l.rotate}>
                            <Position at={0}>
                                <Rod length={5} caps={0.1} rotate={l.knee} />
                            </Position>
                        </Rod>
                    </Position>
                ))}
            </Rod>
        </group>
    )
}

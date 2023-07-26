import { useMemo } from "react"
import { MonsterProps } from "../model/monster"
import { useAtomValue } from "jotai"
import { gameTimeTicksAtom } from "../model/game"
import { Ball, Position, Rod } from "../3d/Parts"

// TODO: Some advanced bugs might have different numbers of legs
const LEG_PAIRS_COUNT = 3
const LEG_CYCLE_SPEED = 1
const LEG_SIDE_AMOUNT = 0.12

export const BugRender = ({ id }: MonsterProps) => {
    const time = useAtomValue(gameTimeTicksAtom)
    const legs = useMemo(() => {
        let legs = []
        for (let n = 0; n < LEG_PAIRS_COUNT; n++) {
            // TODO: We can make a resonable approximation here but the better aim would be to do
            // some inverse kinematics, or possibly just track the position of each foot ourselves;
            // while food is grounded adjust knee to keep consistent leg length, then other half
            // of the cycle the foot is moving to the next target. Might just be a lot of processor
            // work to do all of this tho!
            const left = n % 2 === 0
            const cycle = (n / LEG_PAIRS_COUNT + (!left ? 0 : 0.5) + time * LEG_CYCLE_SPEED) % 1
            const side = Math.cos(cycle * 2 * Math.PI) * LEG_SIDE_AMOUNT
            // Only taking half of the cycle for lift
            const lift = Math.max(0, Math.sin(cycle * 2 * Math.PI))
            const incline = 0.25 + lift * 0.05
            const inflex = -0.5 + lift * 0.1
            legs.push({
                // TODO: We'll also want to be able to refer to limbs by some kind of Id so they
                // can e.g. wield weapons, wear jewellery
                index: (left ? "L" : "R") + (n + 1),
                position: [(n + 1) / (LEG_PAIRS_COUNT + 1), 0, 0] as const,
                rotate: [side, incline, 0],
                knee: [0, inflex, 0]
            })
        }
        return legs
    }, [])
    // TODO: Loads of detail like facial features, feet, knee ball. Let's get this working first
    // tho.
    return (
        <Ball size={2.5}>
            {legs.map((l) => (
                <Position key={l.index} at={l.position} rotate={l.rotate}>
                    {/* // TODO: For memoisation of vector calcs, make these param arrays
                    // memoised as well (or static) */}
                    <Rod length={1} caps={0.5}>
                        {/* <Position at={0} rotate={l.knee}>
                            <Rod length={2.5} caps={0.5} />
                        </Position> */}
                    </Rod>
                </Position>
            ))}
        </Ball>
    )
}

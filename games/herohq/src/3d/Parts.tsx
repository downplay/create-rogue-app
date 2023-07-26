import { Vector3 as Vector } from "@react-three/fiber"
import { PropsWithChildren, createContext, useContext, useMemo } from "react"
import { Vector3, Euler, Quaternion, Matrix3, Matrix4 } from "three"
import { isNumber } from "remeda"

const ORIGIN = [0, 0, 0] as const
const UNIT = [1, 1, 1] as const
const UNIT_X = new Vector3(1, 0, 0)
const UNIT_Y = new Vector3(0, 1, 0)
const UNIT_Z = new Vector3(0, 0, 1)

const toVector3 = (vector: Vector) =>
    vector instanceof Vector3
        ? vector
        : isNumber(vector)
        ? new Vector3(vector)
        : new Vector3(...vector)

const directionToEuler = (direction: Vector) => {
    const vector =
        direction instanceof Vector3
            ? direction
            : isNumber(direction)
            ? new Vector3(direction)
            : new Vector3(...direction)
    const euler = new Euler(
        vector.y * Math.PI, // +/- 90deg tilt (Y movement)
        (vector.x * Math.PI) / 2, // +/- 180deg pan (X movement)
        vector.z * Math.PI, // +/- 180deg roll
        "YXZ"
    )
    return euler
}

const UP_UNIT = new Vector3(0, 1, 0)

const normalToEuler = (normal: Vector) => {
    const v = toVector3(normal)
    const q = new Quaternion()
    q.setFromUnitVectors(UP_UNIT, v)
    const e = new Euler().setFromQuaternion(q)
    return e
}

type RenderContextContext = {
    surface: (direction: Vector) => readonly [position: Vector, normal: Vector]
}

const DEFAULT_RENDER_CONTEXT: RenderContextContext = {
    surface: (direction: Vector) => [ORIGIN, direction]
}

export const RenderContext = createContext(DEFAULT_RENDER_CONTEXT)

export const Position = ({ at, children }: PropsWithChildren<{ at: Vector }>) => {
    const context = useContext(RenderContext)
    const [position, normal] = useMemo(() => context.surface(at), [context, at])
    const rotation = useMemo(() => normalToEuler(normal), [normal])
    return (
        <group position={position} rotation={rotation}>
            {children}
        </group>
    )
}

export const Ball = ({ size = UNIT, children }: PropsWithChildren<{ size: Vector }>) => {
    const childContext = useMemo(() => {
        return {
            surface: (direction: Vector) => {
                const euler = directionToEuler(direction)
                // TODO: Honestly we need to implement a functional Vector library or find a good one
                const unit = new Vector3(0, 0, 1)
                unit.applyEuler(euler)
                if (isNumber(size)) {
                    unit.multiplyScalar(size)
                } else {
                    unit.multiply(toVector3(size))
                }
                return [unit, unit.clone().normalize()] as const
            }
        }
    }, [size])
    return (
        <>
            <mesh scale={size}>
                {/* TODO: Implement LOD somehow. e.g. the 8,8 should increase to something much higher
                close up. And we will probably want to switch in more textures, maybe bump maps,
                maybe even render more advanced algorithmic meshes. */}
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            <RenderContext.Provider value={childContext}>{children}</RenderContext.Provider>
        </>
    )
}

// Caps can be described as;
// 1) Single radius for both ends
// 2) [x,y] Different radius each end
// 3) [[x,y]]
// 3) [[x,y],[x,y]] different radius for both ends
// TODO: It feels a little ambiguous on the [x,y] mode, should this be two different radii or two
// different caps. Or need [[x,y]] if we want different radius but same both ends.
// TODO: Also we could add extra caps options like open/closed etc
type RodCap = number | [number, number]
type RodCaps = RodCap | [RodCap, RodCap]

// TODO: Should be able to extract common patterns, looks very similar to Ball
export const Rod = ({
    length,
    caps = 1,
    children
}: PropsWithChildren<{ length: number; caps?: RodCaps }>) => {
    const matrix = useMemo(() => {
        if (isNumber(caps)) {
            return new Matrix4().makeScale(caps, length, caps)
        } else {
            // TODO: We'll have to do more work on the normal here (and if the rod
            // is tapered even more work and we have to do it *before* applying axis angle)
            throw new Error("Complex caps definition not yet supported")
        }
    }, [caps, length])
    const childContext = useMemo(() => {
        return {
            surface: (direction: Vector) => {
                // X=0, end of end cap. =0.25, side of end cap. =0.5, half way down side. =1, base cap.
                // Logic will be the same for a cuboid but to process y we would also apply square movement.
                const d = toVector3(direction)
                // Add in a 0.25 offset so we're dealing with even blocks of 0.5
                const wrappedX = (d.x + 0.25) % 2
                const position = new Vector3()
                const normal = new Vector3()
                // TODO: We can probably reduce it to 2 if cases with a modulus 2 and a +/-
                // but I need some paper to figure out the logic
                if (wrappedX <= 0.5) {
                    // End cap
                    position.z = 1
                    position.x = wrappedX * 4 - 1
                } else if (wrappedX < 1) {
                    // RHS
                    position.x = 1
                    position.z = 1 - (wrappedX - 0.5) * 2
                } else if (wrappedX <= 1.5) {
                    // Base cap
                    position.z = 0
                    position.x = 1 - (wrappedX - 1) * 4
                } else {
                    // LHS
                    position.x = -1
                    position.z = (wrappedX - 1.5) * 2
                }
                position.applyAxisAngle(UNIT_Z, d.y * Math.PI)
                normal.applyAxisAngle(UNIT_Z, d.y * Math.PI)
                position.applyMatrix4(matrix)
                normal.applyMatrix4(matrix).normalize()
                return [position, normal] as const
            }
        }
    }, [])
    return (
        <>
            <mesh scale={[caps, length, caps]}>
                {/* TODO: Params here are r1,r2,l,res,res (see docs) We could use r1 and r2 to implement
                cap ends BUT it means we have to regenerate geometry any time we wanted to change
                sizes of things, rather than using transforms. Not sure which is preferable. */}
                <cylinderGeometry args={[1, 1, 1, 8, 8]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
            <RenderContext.Provider value={childContext}>{children}</RenderContext.Provider>
        </>
    )
}

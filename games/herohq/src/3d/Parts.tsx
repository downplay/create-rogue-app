import { Vector3 as Vector, useFrame } from "@react-three/fiber"
import {
    PropsWithChildren,
    ReactElement,
    createContext,
    forwardRef,
    useContext,
    useMemo,
    useRef
} from "react"
import { Vector3, Euler, Matrix4, Mesh } from "three"
import { isNumber } from "remeda"

export type Direction = readonly [x: number, y: number, z: number]

export const ORIGIN = new Vector3(0, 0, 0)
export const UNIT = [1, 1, 1] as const
const UNIT_X = new Vector3(1, 0, 0)
const UNIT_Y = new Vector3(0, 1, 0)
const UNIT_Z = new Vector3(0, 0, 1)

// True module. % is actually remainder, not modulo: negative numbers will still
// give us a negative. For true wrapping we need a 2nd %.
const modulo = (n: number, m: number) => ((n % m) + m) % m

const toVector3 = (vector: Vector) =>
    vector instanceof Vector3
        ? vector
        : isNumber(vector)
        ? new Vector3(vector)
        : new Vector3(...vector)

const positionToEuler = (vector: Vector3) => {
    const euler = new Euler(
        0, // vector.z * Math.PI, // +/- 180deg roll
        // Y axis has to be opposite depending on which half of the circle we're in, since it should always move
        // towards the top.
        // TODO: This will mess up if x > 1 or x < -1 so we should modulus the value into this range for convenience
        // TODO: We are maybe needing two different versions of this, it works for e.g. sphere positioning but will
        // it work for every kind of operation?
        ((vector.x >= 0 ? 1 : -1) * (vector.y * Math.PI)) / 2, // +/- 90deg tilt (Y movement)
        vector.x * Math.PI, // +/- 180deg pan (X movement)
        "XYZ"
    )
    return euler
}

const directionToEuler = (direction: Vector) => {
    const vector = toVector3(direction)
    const euler = new Euler(
        (vector.y * Math.PI) / 2, // +/- 90deg tilt (Y movement)
        0, //vector.z * Math.PI, // +/- 180deg twist (Z movement)
        vector.x * Math.PI, // +/- 180deg pan (X movement)
        "ZXY"
    )
    return euler
}

// const UP_UNIT = new Vector3(0, 1, 0)

const ROTATE_X_90 = new Matrix4().makeRotationX(-Math.PI / 2)
// const ROTATE_Z_90 = new Matrix4().makeRotationZ(Math.PI / 2)
// const ROTATE_Y_90 = new Matrix4().makeRotationY(Math.PI / 2)

const normalToEuler = (normal: Vector) => {
    const m = new Matrix4()
    m.lookAt(ORIGIN, toVector3(normal), new Vector3(0, 0, 1))
    // We have to put in an arbitrary 90 twist, for some reason lookAt doesn't quite
    // get us to where we need. Tried various things for UP vector to no avail.
    m.multiply(ROTATE_X_90)
    const e = new Euler().setFromRotationMatrix(m)
    return e
}

type RenderContextContext = {
    surface: (direction: Vector) => readonly [position: Vector3, normal: Vector3]
}

const DEFAULT_RENDER_CONTEXT: RenderContextContext = {
    surface: (direction: Vector) => [ORIGIN, toVector3(direction)]
}

export const RenderContext = createContext(DEFAULT_RENDER_CONTEXT)

export const Position = ({ at, children }: PropsWithChildren<{ at: Vector }>) => {
    const context = useContext(RenderContext)
    const matrix = useMemo(() => {
        // TODO: We should be able to combine position and rotation into single matrix ourselves
        // and slightly optimise rather than nested groups, it is only so they're applied in
        // correct order
        const [position, normal] = context.surface(at)
        const rotation = normalToEuler(normal)
        // return [position,rotation]
        const m1 = new Matrix4().makeTranslation(position)
        const m2 = new Matrix4().makeRotationFromEuler(rotation)
        m1.multiply(m2)
        return m1
    }, [context, at])
    return (
        <group matrix={matrix} matrixAutoUpdate={false}>
            {children}
        </group>
    )
}

export const PositionRef = forwardRef<Vector3 | undefined, PropsWithChildren<{ at: Vector }>>(
    ({ at }, ref) => {
        const context = useContext(RenderContext)
        const [position] = useMemo(() => context.surface(at), [context, at])
        // const ref = useRef<Vector3>()
        const meshRef = useRef<Mesh>(null!)
        // TODO: We could probably do with having world orientation as well. This whole
        // thing is overcomplicated. We rather need a regular <Position> and then a
        // <WorldPositionNotifier> with onPosition and onOrientation callbacks
        useFrame(() => {
            if (meshRef.current && ref) {
                const world = meshRef.current.localToWorld(
                    new Vector3(position.x, position.y, position.z)
                )
                // world.x = world.x + 1
                // console.log("WORLD", world)
                if ("current" in ref) {
                    ref.current = world
                } else {
                    ref(world)
                }
            }
        })
        return <mesh ref={meshRef} />
    }
)

const DEFAULT_MATERIAL = <meshStandardMaterial color="hotpink" />

export const Ball = ({
    size = UNIT,
    children,
    material = DEFAULT_MATERIAL,
    visible = true
}: PropsWithChildren<{ size: Vector; material?: ReactElement<any, any>; visible?: boolean }>) => {
    const childContext = useMemo(() => {
        return {
            surface: (direction: Vector) => {
                const vector = toVector3(direction)
                const euler = positionToEuler(vector)
                // TODO: Honestly we need to implement a functional Vector library or find a good one
                const unit = new Vector3(0, 0.5 + vector.z, 0)
                unit.applyEuler(euler)
                const normal = unit.clone()
                if (isNumber(size)) {
                    unit.multiplyScalar(size)
                    normal.divideScalar(size)
                } else {
                    const vectorSize = toVector3(size)
                    unit.multiply(vectorSize)
                    normal.divide(vectorSize)
                }
                // const vector = toVector3(direction)
                // const euler = positionToEuler(vector)
                // // TODO: Honestly we need to implement a functional Vector library or find a good one
                // const unit = new Vector3(0, 0.5, 0)
                // const normal = unit.clone()
                // if (isNumber(size)) {
                //     unit.multiplyScalar(size)
                //     normal.divideScalar(size)
                // } else {
                //     const vectorSize = toVector3(size)
                //     unit.multiply(vectorSize)
                //     normal.divide(vectorSize)
                // }
                // // unit.y = unit.y + vector.z
                // unit.applyEuler(euler)

                return [unit, normal.normalize()] as const
            }
        }
    }, [size])
    /* TODO: Implement LOD somehow. e.g. the 8,8 should increase to something much higher
            close up. And we will probably want to switch in more textures, maybe bump maps,
            maybe even render more advanced algorithmic meshes. */
    return (
        <>
            {visible && (
                <mesh scale={size} castShadow>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    {material}
                </mesh>
            )}
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
    rotate,
    children,
    material = DEFAULT_MATERIAL
}: PropsWithChildren<{
    length: number
    rotate?: Direction
    caps?: RodCaps
    material?: ReactElement<any, any>
}>) => {
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
                const wrappedX = modulo(d.x + 0.25, 2)
                const position = new Vector3()
                const normal = new Vector3()
                // TODO: We can probably reduce it to 2 if cases with a modulus 2 and a +/-
                // but I need some paper to figure out the logic
                if (wrappedX <= 0.5) {
                    // End cap
                    position.y = 1 + d.z
                    position.x = wrappedX * 4 - 1
                    normal.y = 1
                } else if (wrappedX < 1) {
                    // RHS
                    position.x = 1 + d.z
                    position.y = 1 - (wrappedX - 0.5) * 2
                    normal.x = 1
                } else if (wrappedX <= 1.5) {
                    // Base cap
                    position.y = 0
                    position.x = 1 - (wrappedX - 1) * 4
                    normal.y = -1 - d.z
                } else {
                    // LHS
                    position.x = -1
                    position.y = (wrappedX - 1.5) * 2
                    normal.x = -1 - d.z
                }
                position.applyAxisAngle(UNIT_Y, (position.x >= 0 ? -1 : 1) * d.y * Math.PI)
                normal.applyAxisAngle(UNIT_Y, (position.x >= 0 ? -1 : 1) * d.y * Math.PI)
                position.applyMatrix4(matrix)
                normal.applyMatrix4(matrix).normalize()
                return [position, normal] as const
            }
        }
    }, [])

    const rotation = useMemo(() => {
        const euler = rotate ? directionToEuler(rotate) : undefined
        return euler
    }, [rotate])

    /* TODO: Params here are r1,r2,l,res,res (see docs) We could use r1 and r2 to implement
        cap ends BUT it means we have to regenerate geometry any time we wanted to change
        sizes of things, rather than using transforms. Not sure which is preferable. */

    return (
        <>
            <group rotation={rotation}>
                <mesh scale={[caps, length, caps]} position={[0, length / 2, 0]} castShadow>
                    <cylinderGeometry args={[1, 1, 1, 16, 16]} />
                    {material}
                </mesh>
                <RenderContext.Provider value={childContext}>{children}</RenderContext.Provider>
            </group>
        </>
    )
}

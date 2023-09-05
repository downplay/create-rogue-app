import React, { useMemo, useRef, PropsWithChildren, forwardRef, useEffect } from "react"
import { Position, Rod } from "../../3d/Parts"
import { useSphericalJoint, RapierRigidBody } from "@react-three/rapier"
import { useVector } from "../../gui/hooks"
import { isFunction } from "remeda"

type ChainProps = {
    links: number
    length: number
    width: number
    material?: React.ReactElement<any, any>
    endRef: React.RefObject<RapierRigidBody>
}

const ChainLink = forwardRef(
    (
        {
            count,
            links,
            length,
            width,
            material,
            endRef,
            children
        }: PropsWithChildren<ChainProps & { count: number }>,
        ref
    ) => {
        const position = useVector(0, 0, 0)
        const nextCount = count - 1
        return (
            <Rod ref={ref} length={length / links} caps={width} material={material}>
                <Position at={position}>
                    {nextCount ? (
                        <ChainLink
                            count={nextCount}
                            links={links}
                            length={length}
                            width={width}
                            material={material}
                            endRef={endRef}>
                            {children}
                        </ChainLink>
                    ) : (
                        // TODO: I want to get a ref from the original children and apply another spherical joint.
                        <>{children}</>
                    )}
                </Position>
            </Rod>
        )
    }
)

const ChainLinkPhysics = forwardRef(
    (
        {
            count,
            links,
            length,
            width,
            material,
            children,
            endRef
        }: PropsWithChildren<ChainProps & { count: number }>,
        ref
    ) => {
        const aRef = useRef(null)
        useEffect(() => {
            if (isFunction(ref)) {
                ref(aRef.current)
            } else if (ref) {
                ref.current = aRef.current
            }
        }, [ref, aRef.current])
        const bRef = useRef(null)
        const nextCount = count - 1
        const joint = useSphericalJoint(aRef, nextCount ? bRef : endRef, [
            [0, 0, 0],
            [0, 0, 0]
        ])
        const position = useVector(0, 0, 0)
        return (
            <Rod ref={aRef} length={length / links} caps={width} physics material={material}>
                <Position at={position}>
                    {nextCount ? (
                        <ChainLinkPhysics
                            count={nextCount}
                            ref={bRef}
                            links={links}
                            length={length}
                            width={width}
                            material={material}
                            endRef={endRef}>
                            {children}
                        </ChainLinkPhysics>
                    ) : (
                        // TODO: I want to get a ref from the original children and apply another spherical joint.
                        <>{children}</>
                    )}
                </Position>
            </Rod>
        )
    }
)

export const Chain = ({
    links,
    children,
    physics,
    ...rest
}: PropsWithChildren<ChainProps & { physics?: boolean }>) => {
    return physics ? (
        <ChainLinkPhysics count={links} links={links} {...rest}>
            {children}
        </ChainLinkPhysics>
    ) : (
        <ChainLink count={links} links={links} {...rest}>
            {children}
        </ChainLink>
    )
    // const chain = useMemo(() => {
    //     let output = null
    //     for (let n = 0; n < links; n++) {
    //         output = (
    //             <Rod caps={0.02} length={0.1} material={material}>
    //                 <Position>{output}</Position>
    //             </Rod>
    //         )
    //     }
    //     return output
    // }, [links, length, width])
}

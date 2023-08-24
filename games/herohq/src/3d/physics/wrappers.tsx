import { RigidBody, RigidBodyProps } from "@react-three/rapier"
import { PropsWithChildren, useMemo } from "react"
import { useAtomValue } from "jotai"
import { rngAtom } from "../../model/rng"
import { Vector3Tuple } from "three"

export const WithToss = ({ children, ...rest }: PropsWithChildren<RigidBodyProps>) => {
    const rng = useAtomValue(rngAtom)
    const [angular, linear] = useMemo(() => {
        return [
            [rng.next() * 50 - 25, rng.next() * 10 - 5, rng.next() * 50 - 25],
            [rng.next() - 0.5, rng.next() * 2 + 1, rng.next() - 0.5]
        ] as [Vector3Tuple, Vector3Tuple]
    }, [])
    return (
        <RigidBody angularVelocity={angular} linearVelocity={linear} {...rest}>
            {children}
        </RigidBody>
    )
}

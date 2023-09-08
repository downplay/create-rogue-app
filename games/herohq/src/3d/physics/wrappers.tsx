import { RapierRigidBody, RigidBody, RigidBodyProps } from "@react-three/rapier"
import { PropsWithChildren, forwardRef, useMemo } from "react"
import { useAtomValue } from "jotai"
import { rngAtom } from "../../model/rng"
import { Vector3Tuple } from "three"

export const WithToss = forwardRef<RapierRigidBody, PropsWithChildren<RigidBodyProps>>(
    ({ children, ...rest }, ref) => {
        const rng = useAtomValue(rngAtom)
        const [angular, linear] = useMemo(() => {
            return [
                [rng.next() * 50 - 25, rng.next() * 10 - 5, rng.next() * 50 - 25],
                [rng.next() - 0.5, rng.next() * 2 + 1, rng.next() - 0.5]
            ] as [Vector3Tuple, Vector3Tuple]
        }, [])
        return (
            <RigidBody ref={ref} angularVelocity={angular} linearVelocity={linear} {...rest}>
                {children}
            </RigidBody>
        )
    }
)

import { Position, Rod } from "../../3d/Parts"

export const WizardHatRender = () => {
    return (
        <>
            <Rod caps={1} length={0.01}>
                <Position>
                    <Rod caps={[0.8, 0]} length={1} />
                </Position>
            </Rod>
        </>
    )
}

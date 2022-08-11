import { CHAR_HEIGHT, CHAR_WIDTH } from "./Typography"
import styled from "styled-components"
import { useComponentSlot } from "../with-react/ComponentManager"

const Wrapper = styled.div`
    /* overflow: hidden; */
    position: relative;
    border-style: double;
    border-width: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
`

type WindowProps = {
    name: string
}

export const Window = ({ name }: WindowProps) => {
    const components = useComponentSlot(name)
    return (
        <Wrapper>
            {components.map(({ component: Component, props }) => (
                <Component {...props} />
            ))}
        </Wrapper>
    )
}

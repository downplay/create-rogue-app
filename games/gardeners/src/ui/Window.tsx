import { CHAR_HEIGHT, CHAR_WIDTH } from "./Typography"
import styled from "styled-components"
import { useComponentSlot } from "../with-react/ComponentManager"

const Wrapper = styled.div`
    /* overflow: hidden; */
    position: relative;
    border-style: double;
    border-width: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
    overflow: auto;
`

type WindowProps = {
    name: string
}

export const Window = ({ name }: WindowProps) => {
    const components = useComponentSlot(name)
    // TODO: We need a proper key for the slot
    return (
        <Wrapper>
            {components.map(({ component: Component, props }, i) => (
                <Component key={i} {...props} />
            ))}
        </Wrapper>
    )
}

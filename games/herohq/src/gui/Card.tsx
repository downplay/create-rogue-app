import styled from "@emotion/styled"
import { PropsWithChildren } from "react"

const CardWrapper = styled.div`
    border: solid 2px #000;
    padding: 5px;
`

export const Card = ({ children }: PropsWithChildren<{}>) => {
    return <CardWrapper>{children}</CardWrapper>
}

import React from "react"
import styled from "@emotion/styled"

const Base = styled.button``

export const Button = ({ ...rest }: {} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <Base {...rest} />
}

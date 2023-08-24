import { Global, css, useTheme } from "@emotion/react"
import { useMemo } from "react"

export const GlobalStyles = () => {
    const theme = useTheme()

    const globalCss = useMemo(
        () => css`
            body {
                /* background-color: #000; */
            }
        `,
        [theme]
    )

    return <Global styles={globalCss} />
}

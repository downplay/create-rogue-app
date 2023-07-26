import { Global, css, useTheme } from "@emotion/react"
import { useMemo } from "react"

export const GlobalStyles = () => {
    const theme = useTheme()

    const globalCss = useMemo(() => css``, [theme])

    return <Global styles={globalCss} />
}

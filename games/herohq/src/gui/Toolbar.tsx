import { ReactElement, useCallback } from "react"
import { IconCity, IconDungeon, IconHome, IconInventory, IconRandom } from "./icons"
import { guiPopupAtom, guiStateAtom } from "./Gui"
import { useAtom } from "jotai"
import styled from "@emotion/styled"
import { dungeonAtom } from "../model/dungeon"
import { visibleActorIdsFamily } from "./Dungeon"

const Tools = styled.div`
    position: absolute;
    bottom: 2rem;
`

const ToolButton = ({
    caption,
    icon,
    ...rest
}: { caption: string; icon: ReactElement } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button {...rest}>
            {icon}
            {caption}
        </button>
    )
}

export const Toolbar = () => {
    const [state, setState] = useAtom(guiStateAtom)
    const [popup, setPopup] = useAtom(guiPopupAtom)

    const handleOpenCity = useCallback(() => {
        setPopup({})
        setState({ mode: "town" })
    }, [setPopup, setState])
    const handleOpenHQ = useCallback(() => {
        setPopup({})
        setState({ mode: "hq" })
    }, [setPopup, setState])
    const handleOpenDungeon = useCallback(() => {
        setPopup({})
        setState({ mode: "dungeon", seed: "banana", floor: 1 })
    }, [setPopup, setState])
    const handleOpenInventory = useCallback(() => {
        setPopup(({ name }) => (name === "inventory" ? {} : { name: "inventory" }))
    }, [setPopup])

    const [dungeon, setDungeon] = useAtom(dungeonAtom)
    const handleInitDungeon = useCallback(
        (name: string) => {
            setDungeon({ type: "initialize", generator: name })
        },
        [setDungeon]
    )

    return (
        <Tools>
            <ToolButton caption="City" icon={<IconCity />} onClick={handleOpenCity} />
            <ToolButton caption="HQ" icon={<IconHome />} onClick={handleOpenHQ} />
            {/* // TODO: I think this button will go away as we'll go to the dungeon either via // the
            city tile or by clicking the hero in the roster but for now it's convenient */}
            <ToolButton caption="Dungeon" icon={<IconDungeon />} onClick={handleOpenDungeon} />
            <ToolButton
                caption="Inventory"
                icon={<IconInventory />}
                onClick={handleOpenInventory}
            />
            <ToolButton caption="Generate" icon={<IconRandom />} onClick={handleInitDungeon} />
        </Tools>
    )
}

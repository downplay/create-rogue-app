import { ReactElement, useCallback } from "react"
import styled from "@emotion/styled"
import { Position } from "../model/spacial"
import { IconBarracks, IconCrate, IconGarden, IconKitchen, IconMedic, IconStudy } from "./icons"
import { Cost } from "../model/account"
import { Card } from "./Card"
import { atom, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { guiStateAtom } from "./Gui"
import { Button } from "./Button"
import { PurchaseButton } from "./Currency"

export type HQRoomId = "barracks" | "garden" | "galley" | "store" | "infirmary" | "study"

// TODO: Additional rooms ...
// - armory (craft/upgrade/repair. golems later? or in some kind of workshop)
// - laboratory (potions, frankenstein type creations)
// - dungeon
// - portal hub

type HQRoomDefinition = {
    id: HQRoomId
    caption: string
    description: string
    icon: ReactElement
    position?: Position
    cost: Cost
}

const HQ_ROOMS: HQRoomDefinition[] = [
    {
        id: "barracks",
        caption: "Barracks",
        description:
            "Sleeping area for all your heroes. You must have available beds to recruit new ones!",
        icon: <IconBarracks />,
        cost: 0
    },
    {
        id: "store",
        caption: "Stores",
        description: "",
        icon: <IconCrate />,
        cost: 0
    },
    {
        id: "infirmary",
        caption: "Infirmary",
        description: "Quickly patch up your heroes after a harzardous run in the dungeon",
        icon: <IconMedic />,
        cost: 100
    },
    {
        id: "study",
        caption: "Study",
        description:
            "For all your administrative needs, the study is where you can build your library and pay the bills",
        icon: <IconStudy />,
        cost: 1000
    },
    {
        id: "galley",
        caption: "Galley",
        description: "The heart of any home, here you can cook delicious food to boost your heroes",
        icon: <IconKitchen />,
        cost: 10000
    },
    {
        id: "garden",
        caption: "Garden",
        description: "",
        icon: <IconGarden />,
        cost: 1000000
    }
]

const Background = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`

const DEFAULT_HQ_ROOM_DATA = {
    // TODO: We're ignoring unlocks for now but they'll be triggered by various game events
    unlocked: false,
    purchased: false
}

const hqRoomFamily = (id: string) => {
    const storage = atomWithStorage("HQ:Room:" + id, DEFAULT_HQ_ROOM_DATA)
    return storage
    // return atom(
    //     (get) => get(storage),
    //     (get, set) => {}
    // )
}

const HQRoomCard = ({ room }: { room: HQRoomDefinition }) => {
    const [roomData, setRoomData] = useAtom(hqRoomFamily(room.id))
    const [state, setState] = useAtom(guiStateAtom)

    const handleOpen = useCallback(() => {
        setState((state) => ({ ...state, room: room.id }))
    }, [setState])

    const handlePurchase = useCallback(() => {
        setRoomData((data) => ({ ...data, purchased: true }))
    }, [setRoomData])

    return (
        <Card>
            <h3>
                {room.icon} {room.caption}
            </h3>
            <p>{room.description}</p>
            {roomData.purchased ? (
                <Button onClick={handleOpen}>Open</Button>
            ) : (
                <PurchaseButton
                    cost={room.cost}
                    onClick={handlePurchase}
                    locked={!roomData.unlocked}
                />
            )}
        </Card>
    )
}

// TODO: Later maybe we'll render the whole thing in 3D

export const HQ = () => {
    return (
        <Background>
            {HQ_ROOMS.map((room) => (
                <HQRoomCard room={room}></HQRoomCard>
            ))}
        </Background>
    )
}

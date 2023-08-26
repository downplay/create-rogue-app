import styled from "@emotion/styled"

import { GiGauntlet as IconRightHand } from "react-icons/gi"

export { FaDungeon as IconDungeon } from "react-icons/fa"
export {
    GiShoppingBag as IconInventory,
    GiCrossedSwords as IconArmory,
    GiBunkBeds as IconBarracks,
    GiWoodenCrate as IconCrate,
    GiVineFlower as IconGarden,
    GiSteeltoeBoots as IconFeet
} from "react-icons/gi"
export { MdCastle as IconHome, MdSoupKitchen as IconKitchen } from "react-icons/md"
export { FaMountainCity as IconCity, FaSuitcaseMedical as IconMedic } from "react-icons/fa6"
export { PiBooks as IconStudy, PiCoinVerticalDuotone as IconCoin } from "react-icons/pi"
export { TbMoneybag as IconMoneyBag } from "react-icons/tb"

const Mirror = styled.div`
    transform: scaleX(-1);
`

export const IconLeftHand = () => (
    <Mirror>
        <IconRightHand />
    </Mirror>
)

export { IconRightHand }

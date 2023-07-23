import { IconCoin } from "./icons"
import styled from "@emotion/styled"

const denominate = (amount: number) => {
    let remainder = amount
    let tier = 0
    const components = []
    while (remainder > 0 || tier === 0) {
        const divided = remainder / 100
        const whole = Math.floor(divided)
        const fraction = divided - whole
        components.unshift({
            tier,
            amount: fraction * 100
        })
        tier++
        remainder = whole
    }
    return components
}

// TODO: Maybe name them after animals like Gold Dragon
const COIN_TIERS = [
    {
        id: "wood",
        color: "#a35f00",
        title: "Wooden Nickel"
    },
    {
        id: "iron",
        color: "#d1d1d1",
        title: "Iron Bit"
    },
    {
        id: "gold",
        color: "#ffef8a",
        title: "Gold Piece"
    },
    {
        id: "titanium",
        color: "#bee0e6",
        title: "Titanium Chip"
    }
]

const Coins = styled.div`
    display: flex;
`

const Coin = styled.div<{ color: string }>`
    display: flex;
    color: ${({ color }) => color};
`

export const CoinValue = ({ amount }: { amount: number }) => {
    const tiers = denominate(amount)
    return (
        <Coins>
            {tiers.map((d) => (
                <Coin
                    color={COIN_TIERS[d.tier].color}
                    title={COIN_TIERS[d.tier].color}
                    key={COIN_TIERS[d.tier].id}>
                    <IconCoin />
                    {d.amount}
                </Coin>
            ))}
        </Coins>
    )
}

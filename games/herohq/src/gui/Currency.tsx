import { COIN_TIERS, denominate } from "../model/coin"
import { IconCoin } from "./icons"
import styled from "@emotion/styled"

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

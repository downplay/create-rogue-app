import { Cost } from "../model/account"
import { COIN_TIERS, denominate } from "../model/coin"
import { Button } from "./Button"
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

export const PurchaseButton = ({
    cost,
    locked = false,
    ...rest
}: { cost: Cost; locked?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    // TODO: 1. Check player treasury has enough, disable otherwise.
    // 2. Handle click and deduct the value before calling handler
    return (
        <Button disabled={locked} {...rest}>
            {/* // TODO: Loop through cost if it's an array and render all the value types */}
            <CoinValue amount={typeof cost === "number" ? cost : cost[0].amount} />
        </Button>
    )
}

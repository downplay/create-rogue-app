// TODO: Maybe name them after animals like Gold Dragon
export const COIN_TIERS = [
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

export const denominate = (amount: number) => {
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

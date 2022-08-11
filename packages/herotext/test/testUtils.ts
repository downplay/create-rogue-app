import { RNG, createRng } from "@hero/math"
export const mockRng = (sequence: number[] = [0, 0.25, 0.5, 0.75, 0.9999]): RNG => {
    let pos = 0
    const next = () => {
        const result = sequence[pos]
        pos = (pos + 1) % sequence.length
        return result
    }
    return createRng(next)
}

import seedrandom from "seedrandom"
import random, { RNG, Random } from "random"

const SEED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")
const SEED_BYTES = 32

export const generateSeed = () => {
    let seed = ""
    for (let n = 0; n < SEED_BYTES; n++) {
        seed += random.choice(SEED_CHARS)
    }
    return seed
}

export const makeRng = (seed: string) =>
    // TODO: Raise the bug ticket with Random/seedrandom as we don't need the cast here
    new Random(seedrandom(seed) as unknown as RNG)

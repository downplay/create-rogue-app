import random from "random"

const SEED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("")
const SEED_BYTES = 32

export const generateSeed = () => {
    let seed = ""
    for (let n = 0; n < SEED_BYTES; n++) {
        seed += random.choice(SEED_CHARS)
    }
    return seed
}

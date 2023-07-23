import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import {
    Interviewee,
    availableRecruitsAtom,
    recruitModalVisibleAtom,
    recruitsAtom,
    recruitsSeedAtom,
    recruitsSeedTimeAtom
} from "../model/recruits"
import { Hero } from "../model/hero"
import { useCallback, useMemo } from "react"
import { HeroCard } from "./Roster"
import { atomFamily } from "jotai/utils"
import { gameTimeTicksAtom } from "../model/game"
import { generateSeed } from "../model/rng"
import { rosterHeroesAtom } from "../model/roster"
import { CoinValue } from "./Currency"
import { isNumber } from "remeda"

const wrapHeroFamily = atomFamily((hero: Hero) => atom((get) => hero))

const RecruitCard = ({ recruit }: { recruit: Interviewee }) => {
    const [heroes, setHeroes] = useAtom(rosterHeroesAtom)
    const hero = useAtomValue(recruit.hero)
    const setRecruitVisible = useSetAtom(recruitModalVisibleAtom)
    const handleRecruit = useCallback(() => {
        // TODO: Maybe this should be a set command on the hero themselves, we are effectively
        // setting their owner to be the player themselves
        setHeroes((list) => [...list, hero.id])
        setRecruitVisible(false)
    }, [recruit, setHeroes, setRecruitVisible])

    // TODO: We have a bit of a problem by relying on HeroCard to render the recruit. Since the vitalsFamily
    // generates a separate storage key for the hero id, we'll be storing a bunch of vital statistics
    // for heroes that were never even recruited. Not very happy with this rn but can't see another good
    // way to do it yet.
    return (
        <>
            <HeroCard hero={recruit.hero} />
            <button onClick={handleRecruit}>
                {/* // TODO: Make a <CostValue> component or even just a <CostButton> */}
                Recruit {isNumber(recruit.cost) ? <CoinValue amount={recruit.cost} /> : "?COST?"}
            </button>
        </>
    )
}

export const Recruit = () => {
    const [recruits, setRecruits] = useAtom(availableRecruitsAtom)
    const currentTime = useAtomValue(gameTimeTicksAtom)
    const recruitsSeedTime = useAtomValue(recruitsSeedTimeAtom)
    const setRecruitsSeedAtom = useSetAtom(recruitsSeedAtom)
    const handleRefresh = useCallback(() => {
        // On this refresh since the player will be paying for it, don't change the refresh time
        // (Maybe unless it is very soon!)
        setRecruitsSeedAtom(generateSeed())
    }, [setRecruitsSeedAtom])

    return (
        <>
            {recruits.map((recruit) => (
                <RecruitCard recruit={recruit} />
            ))}
            {/* // TODO: Implement a CostButton and charge increasing amounts with each refresh, and have a short timeout */}
            <button onClick={handleRefresh}>Refresh</button>
            {/* // TODO: Render time friendly like (use another atom actually) */}
            (Refreshes in {recruitsSeedTime - currentTime}s)
        </>
    )
}

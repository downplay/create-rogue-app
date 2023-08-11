import { useCallback } from "react"
import { useAtomValue, useAtom, PrimitiveAtom, useSetAtom, atom } from "jotai"
import styled from "@emotion/styled"

import { rosterAtom } from "../model/roster"
import { recruitModalVisibleAtom } from "../model/recruits"
import { HeroModule, Vital, heroVitalsFamily } from "../model/hero"
import { ActorAtom, LevelData, useData, useModule } from "../model/actor"

const Grid = styled.div`
    display: flex;
    flex-direction: column;
`

const VITALS_THEME = {
    health: {
        symbol: "♥",
        color: "#f00"
    }
} as const

const Bar = styled.div<{ color: string }>`
    background-color: ${({ color }) => color};
`

// TODO: Draw a bar, add colour and icon, friendly format the numbers
const VitalBar = ({ value, type }: { value: Vital; type: "health" }) => (
    <Bar color={VITALS_THEME[type].color}>
        {VITALS_THEME[type].symbol} {value.amount} / {value.maximum}
    </Bar>
)

const HeroWrapper = styled.div<{ active: boolean }>`
    background-color: ${({ active }) => (active ? "#ff0" : "transparent")};
`

const activeDefault = atom(false)

export const HeroCard = ({
    hero: heroAtom,
    // TODO: The active wrapper and select logic needs extracting out of here since it only
    // applies in the roster and not necessarily elsewhere e.g. Recruit screen (and we need the
    // click to trigger recruitment instead)
    // This should actually be a dumb renderer and this also allows us to avoid the weird
    // vitals logic potentially as well.
    active: activeAtom = activeDefault
}: {
    hero: ActorAtom
    active?: PrimitiveAtom<boolean>
}) => {
    const [active, setActive] = useAtom(activeAtom)
    const [hero, setHero] = useAtom(heroAtom)
    const vitals = useAtomValue(heroVitalsFamily(hero.id))
    const handleSelectHero = useCallback(() => {
        setActive(true)
    }, [setActive])
    const heroData = useModule(HeroModule, hero.id)
    const level = useData(LevelData, hero.id)
    return (
        <HeroWrapper onClick={handleSelectHero} active={active}>
            {heroData.name} ({heroData.class})<br />
            Level {level}
            <br />
            Currently {heroData.status}
            <br />
            <VitalBar type="health" value={vitals.health} />
        </HeroWrapper>
    )
}

const Empty = () => {
    const setRecruitVisible = useSetAtom(recruitModalVisibleAtom)
    const handleRecruitDialog = useCallback(() => {
        setRecruitVisible((value) => !value)
    }, [setRecruitVisible])
    return (
        <>
            Empty Bed
            <button onClick={handleRecruitDialog}>Recruit</button>
        </>
    )
}

const Upgrade = ({ locked }: { locked: boolean }) => {
    return locked ? <>Locked!</> : <button>Upgrade</button>
}

export const Roster = () => {
    const roster = useAtomValue(rosterAtom)

    return (
        <Grid>
            {roster.map((slot) => {
                switch (slot.type) {
                    case "hero":
                        return <HeroCard key={slot.index} hero={slot.hero} active={slot.active} />
                    case "empty":
                        return <Empty key={slot.index} />
                    case "upgrade":
                        return <Upgrade key={slot.index} locked={slot.locked} />
                }
            })}
        </Grid>
    )
}

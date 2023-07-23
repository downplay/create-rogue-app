import { useCallback } from "react"
import { useAtomValue, Atom, useAtom, PrimitiveAtom, WritableAtom, useSetAtom, atom } from "jotai"
import styled from "@emotion/styled"

import { rosterAtom } from "../model/roster"
import { Hero, heroVitalsFamily, Vital } from "../model/hero"
import { recruitModalVisibleAtom } from "../model/recruits"

const Grid = styled.div`
    display: flex;
    flex-direction: column;
`

// TODO: Draw a bar, add colour and icon, friendly format the numbers
const VitalBar = ({ value }: { value: Vital }) => (
    <>
        ♥ {value.current} / {value.maximum}
    </>
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
    hero: Atom<Hero>
    active?: PrimitiveAtom<boolean>
}) => {
    const [active, setActive] = useAtom(activeAtom)
    const [hero, setHero] = useAtom(heroAtom)
    const vitals = useAtomValue(heroVitalsFamily(hero.id))
    const handleSelectHero = useCallback(() => {
        setActive(true)
    }, [setActive])
    return (
        <HeroWrapper onClick={handleSelectHero} active={active}>
            {hero.name} ({hero.class})<br />
            Level {hero.level}
            <br />
            Currently {hero.status}
            <br />
            <VitalBar value={vitals.health} />
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

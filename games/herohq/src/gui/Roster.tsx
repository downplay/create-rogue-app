import { useAtomValue, Atom, useAtom, PrimitiveAtom } from "jotai"
import { rosterAtom } from "../model/roster"
import styled from "@emotion/styled"
import { Hero, heroVitalsFamily, Vital } from "../model/hero"

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

const Hero = ({
    hero: heroAtom,
    active: activeAtom
}: {
    hero: Atom<Hero>
    active: Atom<boolean>
}) => {
    const [active, setActive] = useAtom(activeAtom)
    const [hero, setHero] = useAtom(heroAtom)
    const vitals = useAtomValue(heroVitalsFamily(hero.id))
    return (
        <>
            {hero.name} ({hero.class})<br />
            Currently {hero.status}
            <VitalBar value={vitals.health} />
        </>
    )
}

const Empty = () => {
    return (
        <>
            Empty Bed
            <button>Recruit</button>
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
                        return <Hero key={slot.index} hero={slot.hero} active={slot.active} />
                    case "empty":
                        return <Empty key={slot.index} />
                    case "upgrade":
                        return <Upgrade key={slot.index} locked={slot.locked} />
                }
            })}
        </Grid>
    )
}

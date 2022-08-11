import { Line, Emoji } from "./Typography"
import { Meter } from "./controls/Meter"
import { GameState } from "../game/Game"

type StatusProps = {
    party: {
        gold: number
    }
    character: {
        name: string
        health: number
        life: number
        stats: {
            mind: number
            body: number
            spirit: number
        }
    }
    game: GameState
}

export const Status = ({ party, character, game }: StatusProps) => {
    const { mind, body, spirit } = character.stats || {}
    const { life, health } = character
    const { gold } = party
    const { day } = game

    return (
        <>
            <Line>
                <Emoji>🧠</Emoji> {mind}
            </Line>
            <Line>
                <Emoji>💪</Emoji> {body}
            </Line>
            <Line>
                <Emoji>🦵</Emoji> {spirit}
            </Line>
            <Line>
                <Emoji>💓</Emoji>{" "}
                {/* TODO: Anatomical heart 🫀 (emoji 13 https://emojipedia.org/emoji-13.0/) */}
                <Meter total={health} value={life} fore="#00ff00" back="#ff0000" />
            </Line>
            <Line>
                <Emoji>💰</Emoji> {gold}
            </Line>
            <Line>
                <Emoji>🕒</Emoji> {day}
            </Line>
        </>
    )
}

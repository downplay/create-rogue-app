import React from "react";
import { Line, Emoji } from "./Typography";
import { Meter } from "./controls/Meter";
import { PlayerState } from "../game/Player";
import { GameState } from "../engine/game";

type StatusProps = {
  player: PlayerState;
  game: GameState;
};

export const Status = ({ player }: StatusProps) => {
  const { mind, body, spirit } = player.stats;
  const { hp, max } = player.life;
  const { gold } = player;

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
        <Meter total={max} value={hp} fore="#00ff00" back="#ff0000" />
      </Line>
      <Line>
        <Emoji>💰</Emoji> {gold}
      </Line>
    </>
  );
};

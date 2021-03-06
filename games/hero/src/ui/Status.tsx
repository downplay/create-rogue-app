import React from "react";
import { Line, Emoji } from "./Typography";
import { usePlayer } from "../engine/player";
import { getStats } from "../engine/hasStats";
import { Meter } from "./controls/Meter";
import { getLife } from "../engine/hasLife";
import { getInventory } from "../engine/hasInventory";

type StatusProps = {
  player: PlayerState;
};

export const Status = ({ player }) => {
  const { mind, body, spirit,  
  const stats = getStats(player.current);
  const life = getLife(player.current);
  const inventory = getInventory(player.current);

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
        <Meter
          total={stats?.hp}
          value={life || 0}
          fore="#00ff00"
          back="#ff0000"
        />
      </Line>
      <Line>
        <Emoji>💰</Emoji> {inventory?.gold}
      </Line>
    </>
  );
};

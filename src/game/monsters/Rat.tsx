import React from "react";
import { hasTile, tile } from "../../engine/hasTile";
import { Monster, Name, Description } from "../../ui/cards/Monster";
import { entity } from "../../engine/entity";

const RatTile = tile("🐀");

export const Rat = entity(() => {
  hasTile(RatTile);

  const stats = hasStats();

  return (
    <Monster>
      <Name>
        <RatTile />
        Rat
      </Name>
      <Description></Description>
    </Monster>
  );
});

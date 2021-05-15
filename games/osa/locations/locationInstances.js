import { merge, render } from "@hero/text";
import { Bank } from "./Bank";
import { baseLocation } from "./baseLocation";
import { baseCommands } from "../commands/baseCommands";
import { Alley } from "./Alley";
import { PieShop } from "./PieShop";
import { HighStreetSouth } from "./HighStreetSouth";
import { HighStreetNorth } from "./HighStreetNorth";
import { HighStreetMid } from "./HighStreetMid";

const location = (ast) => {
  const merged = merge(baseCommands, baseLocation, ast);
  const state = {};
  const name = render(merged, null, state, "Name");
  return {
    main: merged,
    name,
    state,
    doneSetup: false,
  };
};

export const locationInstances = () =>
  [
    location(Alley),
    location(Bank),
    location(HighStreetMid),
    location(HighStreetNorth),
    location(HighStreetSouth),
    location(PieShop),
  ].reduce((acc, loc) => {
    acc[loc.name] = loc;
    return acc;
  }, {});

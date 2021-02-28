import { Bank } from "./Bank";
import { LOCATION_BANK } from "./locationNames";
import { baseLocation } from "./baseLocation";

const makeInstance = (ast) => {
  const merged = merge(baseLocation, ast);
};

export const locationInstances = () => ({
  [LOCATION_BANK]: makeInstance(Bank),
});

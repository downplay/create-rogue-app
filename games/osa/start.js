import { cliTextEngine } from "./engine/cliTextEngine";
import { Intro } from "./Intro";
import { locationInstances } from "./locations/locationInstances";

const start = () => {
  const engine = cliTextEngine();
  const baseState = {
    engine,
    locations: locationInstances,
  };
  engine.play(Intro, baseState);
};

start();

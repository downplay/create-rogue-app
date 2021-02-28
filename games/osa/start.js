import { cliTextEngine } from "./engine/cliTextEngine";
import { Intro } from "./Intro";

const start = () => {
  const engine = cliTextEngine();

  engine.play(Intro);
};

start();

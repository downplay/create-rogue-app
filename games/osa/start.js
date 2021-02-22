import { cliTextEngine } from "./engine/cliTextEngine";
import { intro } from "./intro";

const start = () => {
  const engine = cliTextEngine();

  engine.play(intro);
};

start();

// import chalk from "chalk";
import readline from "readline";
import { buildRng } from "../../../src/engine/useRng";

const inputChars = (prompt = "?") => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

export const cliTextEngine = () => {
  const rng = buildRng();

  let executions;
  let context;

  const renderResult = async (result) => {
    if (typeof result === "string") {
      console.log(result);
    } else {
      switch (result.type) {
        case "input":
          const input = await inputChars();
          result.execution.yieldValue = input;
          break;
        default:
          return result.toString();
      }
    }
  };
  const engine = {
    play: (story) => {
      const mainLoop = async () => {
        const [results, newExecutions] = story.stream(rng, executions, context);
        for (const result of results) {
          await renderResult(result);
        }
        // Either we're waiting for an input, or the game has finished
        if (!newExecutions.finished) {
          executions = newExecutions;
          mainLoop();
        }
      };
      mainLoop();
    },
  };
  context = { rng, engine };
  return engine;
};

// import chalk from "chalk";
import { stream, createRng } from "herotext";
import readline from "readline";

const inputChars = (prompt = "?") =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });

export const cliTextEngine = () => {
  const rng = createRng();

  // let executions;
  // let context;

  const renderResult = async (result) => {
    if (typeof result === "string") {
      console.log(result);
    } else {
      switch (result.type) {
        case "input": {
          const input = await inputChars();
          // eslint-disable-next-line no-param-reassign
          result.execution.yieldValue = input;
          break;
        }
        default:
          console.log(JSON.stringify(result, null, "  "));
      }
    }
  };
  const engine = {
    play: (story, state) => {
      const mainLoop = async () => {
        let context;
        const [results, newContext] = stream(story, rng, state, context);
        for (const result of results) {
          await renderResult(result);
        }
        // Either we're waiting for an input, or the game has finished
        context = newContext;
        if (!context.finished) {
          mainLoop();
        }
      };
      mainLoop();
    },
  };
  // context = { rng, engine };
  return engine;
};

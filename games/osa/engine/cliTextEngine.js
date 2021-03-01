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
      rl.close();
      resolve(answer.trim());
    });
  });

export const cliTextEngine = () => {
  const rng = createRng();

  let baseState;
  let currentLocation;
  let nextLocation;
  let context;

  const renderResult = async (result, context) => {
    if (typeof result === "undefined" || result === null) {
      return;
    }
    if (typeof result === "string") {
      process.stdout.write(result);
    } else {
      switch (result.type) {
        case "input": {
          const input = await inputChars();
          // eslint-disable-next-line no-param-reassign
          result.strand.internalState = input;
          break;
        }
        case "goto": {
          break;
        }
        default:
        // console.log(
        //   "Unknown result type",
        //   JSON.stringify(result, null, "  ")
        // );
      }
    }
  };

  const engine = {
    go: (locationName) => {
      console.log(context.state.locations);
      const location = context.state.locations[locationName];
      if (!location) {
        throw new Error(`Unknown location: ${locationName}`);
      }
      nextLocation = location;
    },
    play: (story, state) => {
      const mainLoop = async () => {
        if (currentLocation) {
          console.log("LOCATION: ", currentLocation.name);
        }
        const [results, newContext] = currentLocation
          ? stream(currentLocation.main, rng, currentLocation.state, context)
          : stream(story, rng, state, context);
        // eslint-disable-next-line no-param-reassign
        context = newContext;
        for (const result of results) {
          await renderResult(result, context);
        }
        if (nextLocation) {
          currentLocation = nextLocation;
          nextLocation = undefined;
          context = undefined;
        }
        // Either we're waiting for an input, or the game has finished
        if (!context || !context.finished) {
          mainLoop();
        }
      };
      mainLoop();
    },
  };
  // context = { rng, engine };
  return engine;
};

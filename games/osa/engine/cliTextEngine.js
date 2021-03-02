// import chalk from "chalk";
import { stream, createRng } from "herotext";
import { gui } from "./gui";

// const inputChars = (prompt = "?") =>
//   new Promise((resolve) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     rl.question(prompt, (answer) => {
//       rl.close();
//       resolve(answer.trim());
//     });
//   });

export const cliTextEngine = () => {
  const ui = gui();
  const rng = createRng();

  let baseState;
  let currentLocation;
  let nextLocation;
  let context;

  const renderResult = async (result) => {
    if (typeof result === "undefined" || result === null) {
      return;
    }
    if (Array.isArray(result)) {
      result.forEach(renderResult);
    } else if (typeof result === "string") {
      ui.write(result);
    } else {
      switch (result.type) {
        case "input": {
          const input = await ui.readChars();
          // eslint-disable-next-line no-param-reassign
          result.strand.internalState = input;
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
      // TODO: Prob clear text buffer too
      const location = context.state.locations[locationName];
      if (!location) {
        throw new Error(`Unknown location: ${locationName}`);
      }
      nextLocation = location;
    },
    play: (story, state) => {
      const mainLoop = async () => {
        // console.log(baseState);
        const [results, newContext] = currentLocation
          ? stream(
              currentLocation.main,
              rng,
              // TODO: We really need a $global e.g. $global.player, so every location gets the object
              // and we don't have to mess around merging states like this (also, we won't be able to set anything on baseState)
              { ...currentLocation.state, ...baseState },
              context
            )
          : stream(story, rng, state, context);
        // eslint-disable-next-line no-param-reassign
        context = newContext;
        if (currentLocation) {
          currentLocation.state = context.state;
        } else {
          if (nextLocation) {
            console.log(
              "STATE",
              JSON.stringify(context.state.player, null, "  ")
            );
          }
          // process.exit(0);
          baseState = context.state;
        }
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
        } else {
          // TODO: Display a close/restart window
        }
      };
      mainLoop();
    },
  };
  // context = { rng, engine };
  return engine;
};

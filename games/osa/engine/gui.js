import blessed from "blessed";

export const gui = () => {
  const screen = blessed.screen({
    smartCSR: true,
  });

  screen.title = "Old School Adventure 1.0";

  const border = blessed.box({
    top: "center",
    left: "center",
    width: "90%",
    height: "90%",
    tags: true,
    border: {
      type: "line",
    },
    style: {
      fg: "black",
      bg: "white",
      border: {
        fg: "yellow",
        bg: "white",
      },
      //   hover: {
      //     bg: "blue",
      //   },
    },
    // smartCSR: true,
    // useBCE: true,
    // fullUnicode: true,
  });
  const textScroll = blessed.box({
    parent: border,
    scrollable: true,
    alwaysScroll: true,
    top: "top",
    left: "center",
    width: "90%",
    height: "80%",
    style: {
      fg: "black",
      bg: "white",
    },
  });

  const inputBox = blessed.textbox({
    parent: border,
    left: "center",
    top: "80%",
    width: "90%",
    height: "20%",
    style: {
      fg: "black",
      bg: "gray",
      border: {
        fg: "black",
        bg: "yellow",
      },
      hover: {
        bg: "yellow",
      },
    },
  });

  screen.append(border);

  inputBox.key(["escape", "C-c"], (ch, key) => process.exit(0));

  // Focus our element.
  inputBox.focus();

  // Render the screen.
  screen.render();

  return {
    write: (text) => {
      textScroll.setContent(textScroll.content + text);
      const height = textScroll.getScrollHeight();
      textScroll.scrollTo(Math.max(0, height - textScroll.height));
      screen.render();
    },
    readChars: () =>
      new Promise((resolve, reject) => {
        inputBox.clearValue();
        inputBox.readInput((err, value) => {
          if (err) {
            reject(err);
          }
          resolve(value);
        });
        screen.render();
      }),
  };
};

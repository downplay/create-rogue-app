import { parse } from "./parse";

it("Parses simple string", () => {
  expect(parse("Quick brown fox")).toEqual({
    choices: [
      {
        content: [{ text: "Quick brown fox", type: "text" }],
        type: "choice",
        weight: 10,
      },
    ],
    labels: [],
    type: "main",
  });
});

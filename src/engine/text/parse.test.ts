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

it("Parses group", () => {
  expect(parse("(Group)")).toEqual({
    choices: [
      {
        content: [
          {
            content: [{ text: "Group", type: "text" }],
            type: "choice",
            weight: 10,
          },
        ],
        type: "choice",
        weight: 10,
      },
    ],
    labels: [],
    type: "main",
  });

  expect(parse("Text (Group)")).toEqual({
    choices: [
      {
        content: [
          { text: "Text ", type: "text" },
          {
            content: [{ text: "Group", type: "text" }],
            type: "choice",
            weight: 10,
          },
        ],
        type: "choice",
        weight: 10,
      },
    ],
    labels: [],
    type: "main",
  });
});

it("Parses choices", () => {
  expect(parse(`You win|You lose`)).toEqual({
    choices: [
      {
        choices: [
          {
            content: [{ text: "You win", type: "text" }],
            type: "choice",
            weight: 10,
          },
          {
            content: [{ text: "You lose", type: "text" }],
            type: "choice",
            weight: 10,
          },
        ],
        type: "choices",
      },
    ],
    labels: [],
    type: "main",
  });
});

it("Parses labels", () => {
  expect(
    parse(`
main content

label:
hello world
`)
  ).toEqual({
    choices: [
      {
        content: [{ text: "main content", type: "text" }],
        type: "choice",
        weight: 10,
      },
    ],
    labels: [
      {
        content: [{ text: "hello world", type: "text" }],
        name: "label",
        type: "label",
      },
    ],
    type: "main",
  });
  expect(
    parse(`
label:
hello world
`)
  ).toEqual({
    choices: [],
    labels: [
      {
        content: [{ text: "hello world", type: "text" }],
        name: "label",
        type: "label",
      },
    ],
    type: "main",
  });
});

import { parse } from "../index";

it("Parses simple string", () => {
  expect(parse("Quick brown fox")).toEqual({
    content: { text: "Quick brown fox", type: "text" },
    labels: [],
    type: "main",
  });

  expect(parse("Quick (brown) fox")).toEqual({
    content: { text: "Quick (brown) fox", type: "text" },
    labels: [],
    type: "main",
  });
});

it("Parses group", () => {
  expect(parse("[Group]")).toEqual({
    content: { text: "Group", type: "text" },
    labels: [],
    type: "main",
  });

  expect(parse("Text [Group]")).toEqual({
    content: [
      { text: "Text ", type: "text" },
      { text: "Group", type: "text" },
    ],
    labels: [],
    type: "main",
  });
});

it("Parses choices", () => {
  expect(parse(`You win|You lose`)).toEqual({
    content: {
      content: [
        {
          content: { text: "You win", type: "text" },
          type: "choice",
          weight: 10,
        },
        {
          content: { text: "You lose", type: "text" },
          type: "choice",
          weight: 10,
        },
      ],
      type: "choices",
    },
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
    content: { text: "main content", type: "text" },
    labels: [
      {
        content: { text: "hello world", type: "text" },
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
    content: { text: "", type: "text" },
    labels: [
      {
        content: { text: "hello world", type: "text" },
        name: "label",
        type: "label",
      },
    ],
    type: "main",
  });
});

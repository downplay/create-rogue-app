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
  expect(parse(`[You win|You lose]`)).toEqual({
    content: {
      content: [
        {
          content: { text: "You win", type: "text" },
          type: "choice",
          weight: 10,
          preconditions: [],
        },
        {
          content: { text: "You lose", type: "text" },
          type: "choice",
          weight: 10,
          preconditions: [],
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
        merge: false,
        mode: "label",
      },
    ],
    type: "main",
  });
  expect(
    parse(`
label1:
normal label

label2:=
setter label

label3:+
all label

label4:~
merge label

`)
  ).toEqual({
    content: { text: "", type: "text" },
    labels: [
      {
        content: { text: "normal label", type: "text" },
        name: "label1",
        type: "label",
        mode: "label",
        merge: false,
      },
      {
        content: { text: "setter label", type: "text" },
        name: "label2",
        type: "label",
        mode: "set",
        merge: false,
      },
      {
        content: { text: "all label", type: "text" },
        name: "label3",
        type: "label",
        mode: "all",
        merge: false,
      },
      {
        content: { text: "merge label", type: "text" },
        name: "label4",
        type: "label",
        mode: "label",
        merge: true,
      },
    ],
    type: "main",
  });
});

import { parse } from "../index";

it("Parses empty string", () => {
  expect(parse("")).toEqual({
    content: null,
    labels: {},
    type: "main",
  });
});

it("Parses simple string", () => {
  expect(parse("Quick brown fox")).toEqual({
    content: { text: "Quick brown fox", type: "text" },
    labels: {},
    type: "main",
  });

  expect(parse("Quick (brown) fox")).toEqual({
    content: { text: "Quick (brown) fox", type: "text" },
    labels: {},
    type: "main",
  });
});

it("Parses group", () => {
  expect(parse("[Group]")).toEqual({
    content: { text: "Group", type: "text" },
    labels: {},
    type: "main",
  });

  expect(parse("Text [Group]")).toEqual({
    content: { text: "Text Group", type: "text" },
    labels: {},
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
    labels: {},
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
    labels: {
      label: {
        content: { text: "hello world", type: "text" },
        name: "label",
        type: "label",
        merge: false,
        signature: [],
        mode: "label",
      },
    },
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
    content: null,
    labels: {
      label1: {
        content: { text: "normal label", type: "text" },
        name: "label1",
        type: "label",
        mode: "label",
        merge: false,
        signature: [],
      },
      label2: {
        content: { text: "setter label", type: "text" },
        name: "label2",
        type: "label",
        mode: "set",
        merge: false,
        signature: [],
      },
      label3: {
        content: { text: "all label", type: "text" },
        name: "label3",
        type: "label",
        mode: "all",
        merge: false,
        signature: [],
      },
      label4: {
        content: { text: "merge label", type: "text" },
        name: "label4",
        type: "label",
        mode: "label",
        merge: true,
        signature: [],
      },
    },
    type: "main",
  });
});

it("Strips out comments", () => {
  // TODO: Parser should have a mode where comment nodes are included, they're just skipped
  // on render. This enables editor/autoformatting scenarios where we need to understand the parse
  // tree and spit sourc eback out.
  expect(parse("Test//partial line comment")).toEqual({
    content: { text: "Test", type: "text" },
    labels: {},
    type: "main",
  });
  expect(parse("Test\\//partial line comment")).toEqual({
    content: { text: "Test//partial line comment", type: "text" },
    labels: {},
    type: "main",
  });
  expect(
    parse("Block comment /* none of this\nrenders */ end of comment")
  ).toEqual({
    content: { text: "Block comment  end of comment", type: "text" },
    labels: {},
    type: "main",
  });
  expect(
    parse("Block comment \\/* all of this\nrenders */ end of comment")
  ).toEqual({
    content: {
      type: "choices",
      content: [
        {
          content: {
            text: "Block comment /* all of this",
            type: "text",
          },
          preconditions: [],
          type: "choice",
          weight: 10,
        },
        {
          content: {
            text: "renders */ end of comment",
            type: "text",
          },
          preconditions: [],
          type: "choice",
          weight: 10,
        },
      ],
    },
    labels: {},
    type: "main",
  });

  expect(parse("//whole line comment\nTest")).toEqual({
    content: { text: "Test", type: "text" },
    labels: {},
    type: "main",
  });
});

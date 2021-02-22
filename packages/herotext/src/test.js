const assign = {
  match: /\$[a-zA-Z0-9]+=/,
  push: "nospace",
  value: (x) => x.slice(1, x.length - 1),
};
const bassign = {
  match: /\$\([a-zA-Z0-9 ]+\)=/,
  push: "nospace",
  value: (x) => x.slice(2, x.length - 2),
};
const sub = { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1) };
const bsub = { match: /\$\(/, push: "sublabel" };
const bsubend = { match: /\)/, pop: 1 };
const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks: true };
const space = { match: /[ \t]+/, lineBreaks: false };

const lexer = moo.states({
  line: {
    bang: /^!/,
    assign,
    bassign,
    sub,
    bsub,
    label: {
      match: /^[a-zA-Z0-9 ]+:\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelparams",
    },
    labeleq: {
      match: /^[a-zA-Z0-9 ]+:=\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
    },
    labeleqmerge: {
      match: /^[a-zA-Z0-9 ]+:=~\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
    },
    labelplus: {
      match: /^[a-zA-Z0-9 ]+:\+\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelparams",
    },
    labelplusmerge: {
      match: /^[a-zA-Z0-9 ]+:+~\+\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelparams",
    },
    labelmerge: {
      match: /^[a-zA-Z0-9 ]+:~\s*$/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelparams",
    },
    string: /(?:\$\$|\(\(|\)\)|\\[\\()\$\[]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|\[\]])+/,
    newline: { match: /(?:\r\n|\r|\n)/, lineBreaks: true },
    space,
    "[": { match: "[", push: "precondition" },
    $: "$",
    "(": { match: "(", push: "group" },
    ")": { match: ")", pop: 1 },
    "|": "|",
  },
  group: {
    string: {
      match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$|\[\]])+/,
      lineBreaks: true,
    },
    assign,
    bassign,
    sub,
    bsub,
    "[": { match: "[", push: "precondition" },
    "(": { match: "(", push: "group" },
    ")": { match: ")", pop: 1 },
    "|": "|",
  },
  nospace: {
    string: {
      match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\s|\[\]])+/,
      lineBreaks: true,
    },
    assign,
    bassign,
    sub,
    bsub,
    "[": { match: "[", push: "precondition" },
    "(": { match: "(", push: "group" },
    ")": { match: ")", pop: 1 },
    "|": "|",
    space: { match: /(?=[ \t\r\n])/, lineBreaks: true, pop: 1 },
  },
  labelparams: {
    space,
    newline: { ...newline, pop: 1 },
  },
  sublabel: {
    string: { match: /[a-zA-Z0-9 ]+/ },
    assign,
    bassign,
    sub,
    bsub,
    bsubend,
    "(": { match: "(", push: "group" },
    ")": { match: ")", pop: 1 },
    "|": "|",
  },
  precondition: {
    space,
    number: /-?[0-9]+(?:\.[0-9]+)?\%?/,
    compare: /(?:[<>=!]=?)/,
    sub,
    bsub,
    "(": { match: "(", push: "group" },
    "]": { match: "]", pop: 1 },
    ",": ",",
    "%": "%",
    "|": "|",
  },
});

const empty = () => null;

const textContent = (text) => ({ type: "text", text });

const subContent = (label) => {
  // Simplify if there is just a single text element anyway
  if (typeof label !== "string") {
    if (label.type === "text") {
      label = label.text;
    }
  }
  return { type: "substitution", label };
};

const assignContent = (variable, content) => {
  return { type: "assignment", content: choices(content), variable };
};

const choices = (items) => {
  if (items.length === 1) {
    // TODO: Unless some precondition
    return items[0].content;
  }
  if (items.length === 0) {
    // TODO: Should never happen? Actually better to allow it though...
    return textContent("");
  }
  return { type: "choices", content: items };
};

const main = (content, labels) => ({
  type: "main",
  content: choices(content),
  labels,
});

const choice = (content, preconditions = []) => {
  const result = { type: "choice", content, weight: 10, preconditions: [] };
  preconditions.forEach((cond) => {
    if (cond.type === "number" || cond.type === "percent") {
      result.weight = cond.value;
    } else {
      result.preconditions.push(cond);
    }
  });
  return result;
};

const operators = {
  "=": "eq",
  ">=": "gteq",
  "<=": "lteq",
  "~": "near",
  "!=": "noteq",
};

const preComparison = (left = { type: "parameter" }, operator, right) => ({
  left,
  operator: operators[operator],
  right,
});

const numberValue = (value) => {
  let toParse = value;
  if (value[value.length - 1] === "%") {
    toParse = value.slice(0, value.length - 1);
    return {
      type: "percent",
      value: Number(value.slice(0, value.length - 1)),
    };
  }
  return {
    type: "number",
    value: Number(value),
  };
};

const label = (name, items, mode, merge = false) => ({
  type: "label",
  name,
  content: choices(items),
  mode,
  merge,
});

const mergeParts = (a, b) => {
  while (
    a[a.length - 1] &&
    a[a.length - 1].type === "text" &&
    b.type === "text"
  ) {
    b = {
      ...b,
      text: a[a.length - 1].text + b.text,
    };
    a = a.slice(0, a.length - 1);
  }
  return [...a, b];
};

const flatParts = (a) => (a.length === 1 ? a[0] : a);

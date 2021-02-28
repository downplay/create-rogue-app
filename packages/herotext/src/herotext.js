// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require("moo");

const assign = {
  match: /\$[a-zA-Z0-9]+=/,
  push: "nospace",
  value: (x) => x.slice(1, x.length - 1),
};
const bassign = {
  match: /\$\[[a-zA-Z0-9 ]+\]=/,
  push: "nospace",
  value: (x) => x.slice(2, x.length - 2),
};
const sub = { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1) };
const bsub = { match: /\$\[/, push: "sublabel" };
const bsubend = { match: /\]/, pop: 1 };
const func = { match: /\$[a-zA-Z0-9]+\(/, value: (x) => x.slice(1, -1), push: "funcparams" };
const bfuncend = { match: /\]\(/, pop: 1, push: "funcparams" };
const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks: true };
const space = { match: /[ \t]+/, lineBreaks: false };
const input = "$?";

const lexer = moo.states({
  line: {
    bang: /^!/,
    assign,
    bassign,
    func,
    sub,
    bsub,
    input,
    labeleqmerge: {
      match: /^[a-zA-Z0-9 ]+:=~/,
      value: (x) => x.slice(0, x.indexOf(":")),
      lineBreaks: false,
    },
    labeleq: {
      match: /^[a-zA-Z0-9 ]+:=/,
      value: (x) => x.slice(0, x.indexOf(":")),
      lineBreaks: false,
    },
    labelplusmerge: {
      match: /^[a-zA-Z0-9 ]+:+~\+/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
      lineBreaks: false,
    },
    labelplus: {
      match: /^[a-zA-Z0-9 ]+:\+/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
      lineBreaks: false,
    },
    labelmerge: {
      match: /^[a-zA-Z0-9 ]+:~/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
      lineBreaks: false,
    },
    label: {
      match: /^[a-zA-Z0-9 ]+:/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
      lineBreaks: false,
    },
    string: /(?:\$\$|\[\[|\]\]|\\[\\\[\]\{\}\$|:]|\\u[a-fA-F0-9]{4}|[^\\\$\n\r:|\[\]\{\}])+/,
    newline,
    space,
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
  },
  group: {
    string: {
      match: /(?:\$\$|\[\[|\]\]|\\[\\\[\]\{\}\$|]|\\u[a-fA-F0-9]{4}|[^\\\{\}\$|\[\]])+/,
      lineBreaks: true,
    },
    assign,
    bassign,
    sub,
    bsub,
    input,
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
  },
  nospace: {
    string: {
      match: /(?:\$\$|\[\[|\]\]|\\[\\\[\]\$\{\}|]|\\u[a-fA-F0-9]{4}|[^\\\{\}\$\s|\[\]])+/,
      lineBreaks: true,
    },
    assign,
    bassign,
    sub,
    bsub,
    input,
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
    space: { match: /(?=[ \t\r\n])/, lineBreaks: true, pop: 1 },
  },
  labelend: {
    newline: { ...newline, pop: 1 },
    space,
    "(": { match: "(", push: "labelparams" },
  },
  labelparams: {
    sub,
    ",": ",",
	")": { match: ")", pop: 1 },
	// TODO: support spaces in sub names
    space,
    newline,
  },
  sublabel: {
    string: { match: /[a-zA-Z0-9 ]+/ },
    assign,
    bassign,
    func,
    sub,
    bsub,
    bfuncend,
    bsubend,
    input,
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
  },
  funcparams: {
    string: {
      match: /(?:\$\$|\[\[|\]\]|\\[\\\[\]\{\}\$|]|\\u[a-fA-F0-9]{4}|[^,\\\{\}\$|\(\)\[\]])+/,
      lineBreaks: true,
    },
    func,
    sub,
    bsub,
    bfuncend,
	",": ",",
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
  	")": { match: ")", pop: 1 },
    "|": "|",
  },
  precondition: {
    space,
    number: /-?[0-9]+(?:\.[0-9]+)?\%?/,
    compare: /(?:[<>=!]=?|~=?)/,   
    string: /(?:\$\$|\[\[|\]\]|\\[\\\[\]\{\}\$|]|\\u[a-fA-F0-9]{4}|[^,=<>!\\\{\}\$\n\r|\[\]])+/,
    sub,
    bsub,
    "[": { match: "[", push: "group" },
    "}": { match: "}", pop: 1 },
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

const functionCallContent = (label, parameters) => {
  if (typeof label !== "string") {
    if (label.type === "text") {
      label = label.text;
    }
  }
  return { type: "call", label, parameters };
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
    return null;
  }
  return { type: "choices", content: items };
};

const labelsObject = (labelsArray) =>
  labelsArray.reduce((acc, el) => {
    if (acc[el.name]) {
      throw new Error("Duplicate label: " + el.name);
    }
    acc[el.name] = el;
    return acc;
  }, {});

const main = (content, labels) => ({
  type: "main",
  content: choices(content),
  labels: labelsObject(labels),
});

const choice = (content, preconditions = []) => {
  const result = { type: "choice", content, weight: 10, preconditions: [] };
  preconditions.forEach((cond) => {
    if (/*cond.type === "number" || */ cond.type === "percent") {
      result.weight = cond.value;
    } else {
      result.preconditions.push(cond);
    }
  });
  return result;
};

const operators = {
  "==": "eq",
  "=": "eq",
  ">": "gt",
  ">=": "gteq",
  "<": "lt",
  "<=": "lteq",
  "~": "match",
  "!=": "noteq",
  "!~": "notmatch",
};

const preComparison = (left = { type: "parameter" }, operator, right) => ({
  left,
  operator: operators[operator],
  right,
});

const soloValueComparison = (value) => {
  return /*value.type === "number" ||*/ value.type === "percent"
    ? value
    : preComparison(null, "=", value);
};

const numberValue = (value) => {
  let toParse = value;
  if (value[value.length - 1] === "%") {
    toParse = value.slice(0, value.length - 1);
    return {
      type: "percent",
      value: Number(toParse),
    };
  }
  return {
    type: "number",
    value: Number(toParse),
  };
};

const compoundValue = (value) => ({ type: "compound", value });

const label = (name, items, mode, merge = false, signature = []) => ({
  type: "label",
  name,
  content: choices(items),
  mode,
  merge,
  signature,
});

const signatureParam = (name, defaultValue) => ({ type: "param", name, defaultValue });

const inputContent = (value) => ({ type: "input" });

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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "content", "_"], "postprocess": d => main(d[1], [])},
    {"name": "main", "symbols": ["_", "content", "_", "labels", "_"], "postprocess": d => main(d[1], d[3])},
    {"name": "main", "symbols": ["_", "labels", "_"], "postprocess": d => main([], d[1])},
    {"name": "labels", "symbols": ["labelledContent"], "postprocess": d => [d[0]]},
    {"name": "labels", "symbols": ["labels", "labelledContent"], "postprocess": d => [...d[0], d[1]]},
    {"name": "labelledContent", "symbols": ["label", "_", "content", "_"], "postprocess": d => label(d[0][0], d[2], d[0][1], d[0][2], d[0][3])},
    {"name": "label$ebnf$1", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "label$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "label", "symbols": ["labelType", "label$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
    {"name": "label$ebnf$2", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "label$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "label$ebnf$3", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id},
    {"name": "label$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "label", "symbols": ["labelType", "label$ebnf$2", {"literal":"("}, "signature", {"literal":")"}, "label$ebnf$3", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": ([[value,type,merge], _, __, signature]) => [value, type, merge, signature]},
    {"name": "labelType", "symbols": [(lexer.has("label") ? {type: "label"} : label)], "postprocess": d => [d[0].value, "label"]},
    {"name": "labelType", "symbols": [(lexer.has("labeleq") ? {type: "labeleq"} : labeleq)], "postprocess": d => [d[0].value, "set"]},
    {"name": "labelType", "symbols": [(lexer.has("labelplus") ? {type: "labelplus"} : labelplus)], "postprocess": d => [d[0].value, "all"]},
    {"name": "labelType", "symbols": [(lexer.has("labelmerge") ? {type: "labelmerge"} : labelmerge)], "postprocess": d => [d[0].value, "label", true]},
    {"name": "labelType", "symbols": [(lexer.has("labeleqmerge") ? {type: "labeleqmerge"} : labeleqmerge)], "postprocess": d => [d[0].value, "set", true]},
    {"name": "labelType", "symbols": [(lexer.has("labelplusmerge") ? {type: "labelplusmerge"} : labelplusmerge)], "postprocess": d => [d[0].value, "all", true]},
    {"name": "signature", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => [signatureParam(d[0].value)]},
    {"name": "signature", "symbols": ["signature", "_", {"literal":","}, "_", (lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => [...d[0], signatureParam(d[4].value)]},
    {"name": "content", "symbols": ["line"], "postprocess": d => [d[0]]},
    {"name": "content", "symbols": ["content", "line"], "postprocess": d => [...d[0], d[1]]},
    {"name": "line", "symbols": ["choice", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": id},
    {"name": "group", "symbols": [{"literal":"["}, "choices", {"literal":"]"}], "postprocess": d => choices(d[1])},
    {"name": "choices", "symbols": ["choice"], "postprocess": d => [d[0]]},
    {"name": "choices", "symbols": ["choices", {"literal":"|"}, "choice"], "postprocess": d => [...d[0], d[2]]},
    {"name": "choice", "symbols": ["preconditions", "flatParts"], "postprocess": d => choice(d[1], d[0])},
    {"name": "choice", "symbols": ["flatParts"], "postprocess": d => choice(d[0])},
    {"name": "preconditions", "symbols": [{"literal":"{"}, "conditions", {"literal":"}"}], "postprocess": d => d[1]},
    {"name": "conditions", "symbols": ["condition"], "postprocess": d => [d[0]]},
    {"name": "conditions", "symbols": ["conditions", {"literal":","}, "condition"], "postprocess": d => [...d[0], d[2]]},
    {"name": "condition", "symbols": ["conditionValue"], "postprocess": d => soloValueComparison(d[0])},
    {"name": "condition", "symbols": [(lexer.has("compare") ? {type: "compare"} : compare), "conditionValue"], "postprocess": d => preComparison(null, d[0].value, d[1])},
    {"name": "condition", "symbols": ["conditionValue", (lexer.has("compare") ? {type: "compare"} : compare), "conditionValue"], "postprocess": d => preComparison(d[0], d[1].value, d[2])},
    {"name": "conditionValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => numberValue(d[0].value)},
    {"name": "conditionValue", "symbols": ["parts"], "postprocess": d => compoundValue(d[0])},
    {"name": "flatParts", "symbols": ["parts"], "postprocess": d => flatParts(d[0])},
    {"name": "parts", "symbols": ["part"], "postprocess": d => [d[0]]},
    {"name": "parts", "symbols": ["parts", "part"], "postprocess": d => [...d[0], d[1]]},
    {"name": "part", "symbols": ["string"], "postprocess": d => textContent(d[0])},
    {"name": "part", "symbols": ["assignment"], "postprocess": id},
    {"name": "part", "symbols": ["substitution"], "postprocess": id},
    {"name": "part", "symbols": ["input"], "postprocess": id},
    {"name": "part", "symbols": ["group"], "postprocess": id},
    {"name": "part", "symbols": ["functionCall"], "postprocess": id},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => d[0].value},
    {"name": "assignment", "symbols": [(lexer.has("assign") ? {type: "assign"} : assign), "choices", (lexer.has("space") ? {type: "space"} : space)], "postprocess": d => assignContent(d[0].value, d[1])},
    {"name": "assignment", "symbols": [(lexer.has("bassign") ? {type: "bassign"} : bassign), "choices", (lexer.has("space") ? {type: "space"} : space)], "postprocess": d => assignContent(d[0].value, d[1])},
    {"name": "substitution", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => subContent(d[0].value)},
    {"name": "substitution", "symbols": [(lexer.has("bsub") ? {type: "bsub"} : bsub), "choices", (lexer.has("bsubend") ? {type: "bsubend"} : bsubend)], "postprocess": d => subContent(choices(d[1]))},
    {"name": "functionCall", "symbols": [(lexer.has("func") ? {type: "func"} : func), "parameters", {"literal":")"}], "postprocess": d => functionCallContent(d[0].value, d[1])},
    {"name": "functionCall", "symbols": [(lexer.has("bsub") ? {type: "bsub"} : bsub), "choices", (lexer.has("bfuncend") ? {type: "bfuncend"} : bfuncend), "parameters", {"literal":")"}], "postprocess": d => functionCallContent(choices(d[1]), d[3])},
    {"name": "parameters", "symbols": ["parameter"], "postprocess": d => [d[0]]},
    {"name": "parameters", "symbols": ["parameters", {"literal":","}, "parameter"], "postprocess": d => [...d[0], d[2]]},
    {"name": "parameter", "symbols": ["choices"], "postprocess": d => choices(d[0])},
    {"name": "input", "symbols": [(lexer.has("input") ? {type: "input"} : input)], "postprocess": d => inputContent()},
    {"name": "_", "symbols": ["whitespace"]},
    {"name": "_", "symbols": [], "postprocess": empty},
    {"name": "whitespace", "symbols": ["whitespace", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "whitespace", "symbols": ["whitespace", (lexer.has("space") ? {type: "space"} : space)]},
    {"name": "whitespace", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "whitespace", "symbols": [(lexer.has("space") ? {type: "space"} : space)]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

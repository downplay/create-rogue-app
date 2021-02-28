@{%

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

%}

@lexer lexer

main              -> _ content _                    {% d => main(d[1], []) %}
                  | _ content _ labels _           {% d => main(d[1], d[3]) %}
                  | _ labels _                     {% d => main([], d[1]) %}

labels           -> labelledContent                {% d => [d[0]] %}    
                  | labels labelledContent         {% d => [...d[0], d[1]] %}

labelledContent  -> label _ content _          {% d => label(d[0][0], d[2], d[0][1], d[0][2], d[0][3]) %}

# TODO: Shouldn't allow a signature on label types that don't support (e.g. eq)
label             -> labelType %space:? %newline                {% id %}
                    | labelType %space:? "(" signature ")" %space:? %newline  {% ([[value,type,merge], _, __, signature]) => [value, type, merge, signature] %}

labelType         -> %label                {% d => [d[0].value, "label"] %}
                   | %labeleq              {% d => [d[0].value, "set"] %}
                   | %labelplus            {% d => [d[0].value, "all"] %}
                   | %labelmerge           {% d => [d[0].value, "label", true] %}
                   | %labeleqmerge         {% d => [d[0].value, "set", true] %}
                   | %labelplusmerge       {% d => [d[0].value, "all", true] %}

# TODO: Default values
signature         -> %sub                           {% d => [signatureParam(d[0].value)] %}
                   | signature _ "," _ %sub         {% d => [...d[0], signatureParam(d[4].value)] %}

content           -> line                           {% d => [d[0]] %}
                   | content line                   {% d => [...d[0], d[1]] %}

line              -> choice %newline                {% id %}

group             -> "[" choices "]"                {% d => choices(d[1]) %}

choices           -> choice                         {% d => [d[0]] %}                         
                    | choices "|" choice            {% d => [...d[0], d[2]] %}

choice            -> preconditions flatParts        {% d => choice(d[1], d[0]) %}
                   | flatParts                      {% d => choice(d[0]) %}

preconditions     -> "{" conditions "}"             {% d => d[1] %}

conditions        -> condition                      {% d => [d[0]] %}                     
                   | conditions "," condition       {% d => [...d[0], d[2]] %}

condition         -> conditionValue                 {% d => soloValueComparison(d[0]) %}
                   | %compare conditionValue        {% d => preComparison(null, d[0].value, d[1]) %}
                   | conditionValue %compare conditionValue {% d => preComparison(d[0], d[1].value, d[2]) %}

conditionValue    -> %number                        {% d => numberValue(d[0].value) %}
                   | parts                          {% d => compoundValue(d[0]) %}

flatParts         -> parts                          {% d => flatParts(d[0]) %}

parts             -> part                           {% d => [d[0]] %}
                   | parts part                     {% d => [...d[0], d[1]] %}

part              -> string                         {% d => textContent(d[0]) %}
                   | assignment                     {% id %}
                   | substitution                   {% id %}
                   | input                          {% id %}
                   | group                          {% id %}
                   | functionCall                   {% id %}

string            -> %string                        {% d => d[0].value %}

assignment        -> %assign choices %space         {% d => assignContent(d[0].value, choices(d[1])) %}
                   | %bassign choices %space        {% d => assignContent(d[0].value, choices(d[1])) %}

substitution      -> %sub                          {% d => subContent(d[0].value) %}
                   | %bsub choices %bsubend          {% d => subContent(choices(d[1])) %}

functionCall      -> %func parameters ")"            {% d => functionCallContent(d[0].value, d[1]) %}
                   | %bsub choices %bfuncend parameters ")" {% d => functionCallContent(choices(d[1]), d[3]) %}

parameters        -> parameter                      {% d => [d[0]] %}                     
                   | parameters "," parameter       {% d => [...d[0], d[2]] %}

# TODO: Named parameters. Would also be similar to an object hash.
parameter         -> choices                        {% d => choices(d[0]) %}

input             -> %input                         {% d => inputContent() %}

_                 -> whitespace | null              {% empty %} 

whitespace        -> whitespace %newline
                   | whitespace %space
                   | %newline
                   | %space
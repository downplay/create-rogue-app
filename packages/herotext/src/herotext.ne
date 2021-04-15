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

const sub = { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1), push: "subpath" };
const bsub = { match: /\$\[/, push: "sublabel" };
const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks: true };
const space = { match: /[ \t]+/, lineBreaks: false };
const input = "$?";

const escape = { match: /\\[\\\[\]\{\}\$|:\/]/, value: (x) => x[1] };
const lineComment = { match: /\/\/.*$/ };
const blockComment = { match: /\/\*/, push: "comment" };

const lexer = moo.states({
  line: {
    bang: /^!/,
    assign,
    bassign,
    sub,
    bsub,
    input,
    labeleqmerge: {
      match: /^[a-zA-Z0-9 ]+:=~/,
      value: (x) => x.slice(0, x.indexOf(":")),
    },
    labeleq: {
      match: /^[a-zA-Z0-9 ]+:=/,
      value: (x) => x.slice(0, x.indexOf(":")),
    },
    labelplusmerge: {
      match: /^[a-zA-Z0-9 ]+:\+~/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
    },
    labelplus: {
      match: /^[a-zA-Z0-9 ]+:\+/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
    },
    labelmerge: {
      match: /^[a-zA-Z0-9 ]+:~/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
    },
    label: {
      match: /^[a-zA-Z0-9 ]+:/,
      value: (x) => x.slice(0, x.indexOf(":")),
      push: "labelend",
    },
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
    lineComment,
    blockComment,
    newline,
    space,
    escape,
    string: moo.fallback
  },
  group: {
    assign,
    bassign,
    sub,
    bsub,
    input,
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "]": { match: "]", pop: 1 },
    "|": "|",
    lineComment,
    blockComment,
    space,
    escape,
    string: moo.fallback
  },
  nospace: {
    assign,
    bassign,
    sub,
    bsub,
    input,
    escape,
    // TODO: nospace is kinda broken anyway, would be nice to switch to moo.fallback, but the precondition
    // catch-all does it instead; would need a weird group of most non-alphanumeric chars instead
    string: {
      match: /(?:\$\$|\\[\\\[\]\$\{\}|]|\\u[a-fA-F0-9]{4}|[^\\\{\}\$\s|\[\]])+/,
      lineBreaks: false,
    },
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    "|": "|",
    nospaceend: { match: /(?=[^])/, lineBreaks: true, pop: 1 },
  },
  labelend: {
    newline: { ...newline, pop: 1 },
    space,
    "(": { match: "(", push: "labelparams" },
  },
  labelparams: {
    // TODO: support spaces in var names
    varname: { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1)},
    "?": "?",
    ",": ",",
    ")": { match: ")", pop: 1 },
    space,
    newline,
    lineComment,
    blockComment,
  },
  subpath: {
    path: { match: /\.[a-zA-Z0-9]+/, value: (x) => x.slice(1) },
    bpath: { match: /\.\[/, next: "sublabel" },
    "(": { match: "(", next: "funcparams" },
    pathend: { match: /(?=[^])/, pop: 1, lineBreaks: true }
  },
  sublabel: {
    string: { match: /[a-zA-Z0-9 ]+/ },
    assign,
    bassign,
    sub,
    bsub,
    input,
    "[": { match: "[", push: "group" },
    "]": { match: "]", next: "subpath" },
    "|": "|",
  },
  // TODO: Comments inside funcparams should be able to work
  funcparams: {
    //assign,
    //bassign,
    sub,
    bsub,
    input,
    ",": ",",
    "{": { match: "{", push: "precondition" },
    "[": { match: "[", push: "group" },
    ")": { match: ")", pop: 1 },
    "|": "|",
    lineComment,
    blockComment,
    string: moo.fallback
  },
  precondition: {
    number: /-?[0-9]+(?:\.[0-9]+)?\%?/,
    compare: /(?:[<>=!]=?|~=?)/,   
    sub,
    bsub,
    "[": { match: "[", push: "group" },
    "}": { match: "}", pop: 1 },
    ",": ",",
    "%": "%",
    "|": "|",
    space,
    escape,
    string: moo.fallback
  },
  comment: {
    endComment: { match: "*/", pop: 1 },
    string: moo.fallback
  }
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
  return { type: "substitution", path: label };
};

const functionCallContent = (label, parameters) => {
  if (typeof label !== "string") {
    if (label.type === "text") {
      label = label.text;
    }
  }
  return { type: "invoke", path: label, parameters };
};

const assignContent = (variable, content) => {
  return { type: "assignment", content: choices(content), variable };
};

const choices = (items) => {
  if (items) {
    items = items.filter(item => item !== null);
  }
  if (items === null || items.length === 0) {
    return null;
  }
  if (items.length === 1 && items[0].preconditions && items[0].preconditions.length === 0) {
    return items[0].content;
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

const choice = (content, preconditions) => {
  const result = { type: "choice", content, weight: 10, preconditions: [] };
  if (preconditions) {
    preconditions.forEach((cond) => {
      if (/*cond.type === "number" || */ cond.type === "percent") {
        result.weight = cond.value;
      } else {
        result.preconditions.push(cond);
      }
    });
  }
  return result;
};

const operators = {
  "==": "eqeq",
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

const signatureParam = (name, optional, defaultValue) => ({ type: "param", name, optional, defaultValue });

const inputContent = (value) => ({ type: "input" });

const mergeParts = (parts) => {
  const merged = [];
  let last = undefined;
  for (const part of parts) {
    if (part === null || typeof part === "undefined") {
      continue;
    }
    if (last && last.type === "text" && part.type === "text") {
      last.text = last.text + part.text;
    } else {
      if (part && part.type === "text") {
        last = {...part};
      } else {
        last = part;
      }
      merged.push(last);
    }
  }
  return merged;
};

const flatParts = (a) => {
  if (typeof a === "string") {
    throw new Error("String: " + a );
  }
  const merged = mergeParts(a);
  return (merged.length <= 1 ? (merged[0] || null) : merged);
}

%}

@lexer lexer

main              -> _ content _           {% d => main(d[1], []) %}
                   | _ content _ labels     {% d => main(d[1], d[3]) %}
                   | _ labels               {% d => main([], d[1]) %}

labels            -> labelledContent:+      {% id %}

labelledContent   -> label _ content _      {% d => label(d[0][0], d[2], d[0][1], d[0][2], d[0][3]) %}

# TODO: Shouldn't allow a signature on label types that don't support (e.g. eq)
label             -> labelType %space:? %newline                {% id %}
                   | labelType %space:? "(" signature ")" %space:? %newline
                         {% ([[value,type,merge], _, __, signature]) => [value, type, merge, signature] %}

labelType         -> %label                {% d => [d[0].value, "label"] %}
                   | %labeleq              {% d => [d[0].value, "set"] %}
                   | %labelplus            {% d => [d[0].value, "all"] %}
                   | %labelmerge           {% d => [d[0].value, "label", true] %}
                   | %labeleqmerge         {% d => [d[0].value, "set", true] %}
                   | %labelplusmerge       {% d => [d[0].value, "all", true] %}

# TODO: Default values
signature         -> signatureParam        {% d => [d[0]] %}
                   | signature _ "," _ signatureParam 
                                           {% d => [...d[0], d[4]] %}

signatureParam    -> %varname "?":?        {% d => signatureParam(d[0].value, d[1] && true) %}

content           -> line:+                         {% id %}

# Lines can be observed as empty only if they begin will an (allowably empty) precondition
line              -> preconditions parts %newline   {% d => choice(d[1], d[0]) %}
                   | requiredParts %newline         {% d => d[0] === null ? null : choice(d[0]) %}

group             -> "[" choices "]"                {% d => choices(d[1]) %}

choices           -> choice                         {% d => [d[0]] %}                         
                   | choices "|" choice             {% d => [...d[0], d[2]] %}

choice            -> preconditions:? parts          {% d => choice(d[1], d[0]) %}

preconditions     -> "{" conditions:? "}"           {% d => d[1] || [] %}

conditions        -> condition                      {% d => [d[0]] %}                     
                   | conditions "," condition       {% d => [...d[0], d[2]] %}

condition         -> conditionValue                 {% d => soloValueComparison(d[0]) %}
                   | %compare conditionValue        {% d => preComparison(null, d[0].value, d[1]) %}
                   | conditionValue %compare conditionValue 
                                                    {% d => preComparison(d[0], d[1].value, d[2]) %}

conditionValue    -> %number                        {% d => numberValue(d[0].value) %}
                   | requiredParts                  {% d => compoundValue(d[0]) %}

parts             -> part:*                         {% d => flatParts(d[0] || []) %}

requiredParts     -> part:+                         {% d => flatParts(d[0]) %}

part              -> string                         {% d => textContent(d[0]) %}
                   | assignment                     {% id %}
                   | substitution                   {% id %}
                   | input                          {% id %}
                   | group                          {% id %}
                   | functionCall                   {% id %}
                   | comment                        {% empty %}

string            -> %string                        {% d => d[0].value %}
                   | %escape                        {% d => d[0].value %}
                   | %space                         {% d => d[0].value %}

comment           -> %lineComment                      {% empty %}
                   | %blockComment %string %endComment {% empty %}

assignment        -> %assign choices %nospaceend    {% d => assignContent(d[0].value, d[1]) %}
                   | %bassign choices %nospaceend   {% d => assignContent(d[0].value, d[1]) %}

substitution      -> substitutionPath %pathend      {% d => subContent(d[0]) %}

functionCall      -> substitutionPath "(" parameters ")"   {% d => functionCallContent(d[0], d[2]) %}

# TODO: Can probably be simplified to two rules ... somehow
substitutionPath  -> %sub                           {% d => [d[0].value] %}
                   | %bsub choices "]"              {% d => [choices(d[1])] %}
                   | %sub substitutionPathParts     {% d => [d[0].value, ...d[1]] %}
                   | %bsub choices "]" substitutionPathParts
                        {% d => [choices(d[1]), ...d[3]] %}

substitutionPathParts -> substitutionPathPart:+     {% id %}

substitutionPathPart -> %path                       {% d => d[0].value %}
                   | %bpath choices "]"             {% d => choices(d[1]) %}

parameters        -> parameter                      {% d => [d[0]] %}                     
                   | parameters "," parameter       {% d => [...d[0], d[2]] %}

# TODO: Named parameters. Would also be similar to an object hash.
parameter         -> choices                        {% d => choices(d[0]) %}

input             -> %input                         {% d => inputContent() %}

_                 -> whitespace:*                   {% empty %} 

whitespace        -> (%newline | %space | comment)  {% empty %}

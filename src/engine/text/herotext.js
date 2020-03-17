// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require('moo')

let lexer = moo.compile({
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	sub: /\$[a-zA-Z0-9]+/,
	bang: /^!/,
	label: /^[a-zA-Z0-9]+:$/,
    string: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|])+/,
	newline: {match:/(?:\r\n|\r|\n)/, lineBreaks:true},
    space: {match: /[.\t]+/, lineBreaks: false},
    '$': '$',
    '(': '(',
	')': ')',
    '|': '|',
    ':': ':',
    '!': '!',
    true: 'true',
    false: 'false',
    null: 'null',
})

const empty = () => null

const textContent = (text) => ({type:"text", text})

const subContent = (label) => ({type:"substitution", label})

const choice = (content) => ({type:"choice", content, weight: 10})

const main = (choices, labels) => ({type: "main", choices, labels})

const label = (name, choices) => ({type: "label", name, choices})

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "content", "_"], "postprocess": d => main(d[1])},
    {"name": "main", "symbols": ["_", "content", "_", "labels", "_"], "postprocess": d => main(d[1], d[3])},
    {"name": "content", "symbols": ["line"], "postprocess": d => [d[0]]},
    {"name": "content", "symbols": ["content", "line"], "postprocess": d => [...d[0], d[1]]},
    {"name": "content", "symbols": ["content", "bangLine"], "postprocess": d => [...d[0], d[1]]},
    {"name": "labels", "symbols": ["labelledContent"], "postprocess": d => [d[0]]},
    {"name": "labels", "symbols": ["labels", "labelledContent"], "postprocess": d => [...d[0], d[1]]},
    {"name": "labelledContent", "symbols": ["_", "label", "_", "content"], "postprocess": d => label(d[1], d[3])},
    {"name": "label", "symbols": ["newline", (lexer.has("label") ? {type: "label"} : label), "newline"], "postprocess": d => d[1].value.slice(0, d[1].value.length - 1)},
    {"name": "line", "symbols": ["parts", "newline"], "postprocess": d => choice(d[0])},
    {"name": "bangLine$ebnf$1", "symbols": ["parts"], "postprocess": id},
    {"name": "bangLine$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "bangLine", "symbols": [{"literal":"!"}, "bangLine$ebnf$1", "newline"], "postprocess": d => choice(d[1] || [])},
    {"name": "parts", "symbols": ["part"], "postprocess": d => [d[0]]},
    {"name": "parts", "symbols": ["parts", "part"], "postprocess": d => [...d[0], d[1]]},
    {"name": "part", "symbols": ["string"], "postprocess": d => textContent(d[0])},
    {"name": "part", "symbols": ["complexPart"], "postprocess": id},
    {"name": "complexPart", "symbols": ["choice"], "postprocess": id},
    {"name": "complexPart", "symbols": ["substitution"], "postprocess": id},
    {"name": "choice", "symbols": [{"literal":"("}, "choiceItems", {"literal":")"}], "postprocess": d=> ({ type: "choices", choices: d[1] })},
    {"name": "choiceItems", "symbols": ["choiceItem"], "postprocess": d => [choice(d[0])]},
    {"name": "choiceItems", "symbols": ["choiceItems", {"literal":"|"}, "choiceItem"], "postprocess": d => ([...d[0],choice(d[2])])},
    {"name": "choiceItem", "symbols": ["choicePart"], "postprocess": id},
    {"name": "choiceItem", "symbols": ["choiceItem", "choicePart"], "postprocess": d => [...d[0], d[1]]},
    {"name": "choicePart", "symbols": ["multiline"], "postprocess": d => textContent(d[0])},
    {"name": "choicePart", "symbols": ["complexPart"], "postprocess": id},
    {"name": "multiline", "symbols": ["string"], "postprocess": id},
    {"name": "multiline", "symbols": ["string", "newline", "multiline"], "postprocess": d => d[0] + "\n" + d[2]},
    {"name": "substitution", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => subContent(d[0].value.slice(1))},
    {"name": "substitution", "symbols": [{"literal":"$"}, {"literal":"("}, "string", {"literal":")"}], "postprocess": d => subContent(d[2])},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => d[0].value},
    {"name": "newline", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": empty},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": empty},
    {"name": "_", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": empty},
    {"name": "_", "symbols": [], "postprocess": empty}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

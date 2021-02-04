// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


 const moo = require('moo')
 
		const assign = /\$[a-zA-Z0-9]+=[\$a-zA-Z0-9]+/
		const bassign = /\$\([a-zA-Z0-9]+=[\$a-zA-Z0-9]+\)/
		const sub =  /\$[a-zA-Z0-9]+/
		const bsub = /\$\([a-zA-Z0-9 ]+\)/
	  
const lexer = moo.states({
	line: {
		bang: /^!/,
		assign,
		bassign,
		sub,
		bsub,
		label: /^[a-zA-Z0-9 ]+:$/,
		string: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|])+/,
		newline: { match: /(?:\r\n|\r|\n)/, lineBreaks:true },
		space: { match: /[.\t]+/, lineBreaks: false },
		'$': '$',
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
		':': ':',
		'!': '!',
	},
	group: {
		string: { match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$|])+/, lineBreaks:true },
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	}
})

const empty = () => null

const textContent = (text) => ({type:"text", text})

const subContent = (label) => ({type:"substitution", label})

const assignContent = (ab) => {
	const split = ab.split("=");
	return ({type:"assignment", label: split[1], variable: split[0]})
}

const choices = (items) => {
	if (items.length === 1) {
		// TODO: Unless some precondition
		return items[0].content;
	}
	if (items.length === 0) {
		// TODO: Should never happen? Actually better to allow it though...
		return textContext("");
	}
	return {type: "choices", choices: items}
}

const main = (choices, labels) => ({type: "main", choices, labels})

const choice = (content) => ({type:"choice", content, weight: 10})

const label = (name, items) => ({type: "label", name, content: choices(items)})

const mergeParts = (a, b) => {
	while (a[a.length-1] && a[a.length-1].type === "text" && b.type === "text") {
		b = {
			...b,
			text: a[a.length-1].text + b.text
		};
		a = a.slice(0, a.length-1);
	}
	return [...a, b];
}

const bracketSlice = value => value.slice(2, value.length - 1)

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "content", "_"], "postprocess": d => main(d[1], [])},
    {"name": "main", "symbols": ["_", "content", "_", "labels", "_"], "postprocess": d => main(d[1], d[3])},
    {"name": "main", "symbols": ["_", "labels", "_"], "postprocess": d => main(null, d[1])},
    {"name": "labels", "symbols": ["labelledContent"], "postprocess": d => [d[0]]},
    {"name": "labels", "symbols": ["labels", "labelledContent"], "postprocess": d => [...d[0], d[1]]},
    {"name": "labelledContent", "symbols": ["label", "_", "content", "_"], "postprocess": d => label(d[0], d[2])},
    {"name": "label", "symbols": [(lexer.has("label") ? {type: "label"} : label), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => d[0].value.slice(0, d[0].value.length - 1)},
    {"name": "content", "symbols": ["line"], "postprocess": d => [d[0]]},
    {"name": "content", "symbols": ["content", "line"], "postprocess": d => [...d[0], d[1]]},
    {"name": "line", "symbols": ["choices", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => choice(choices(d[0]))},
    {"name": "group", "symbols": [{"literal":"("}, "choices", {"literal":")"}], "postprocess": d => choices(d[1])},
    {"name": "choices", "symbols": ["choice"], "postprocess": d => [d[0]]},
    {"name": "choices", "symbols": ["choices", {"literal":"|"}, "choice"], "postprocess": d => [...d[0], d[2]]},
    {"name": "choice", "symbols": ["parts"], "postprocess": d => choice(d[0])},
    {"name": "parts", "symbols": ["part"], "postprocess": d => [d[0]]},
    {"name": "parts", "symbols": ["parts", "part"], "postprocess": d => [...d[0], d[1]]},
    {"name": "part", "symbols": ["string"], "postprocess": d => textContent(d[0])},
    {"name": "part", "symbols": ["group"], "postprocess": id},
    {"name": "part", "symbols": ["substitution"], "postprocess": id},
    {"name": "substitution", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => subContent(d[0].value.slice(1))},
    {"name": "substitution", "symbols": [(lexer.has("bsub") ? {type: "bsub"} : bsub)], "postprocess": d => subContent(bracketSlice(d[0].value))},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => d[0].value},
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

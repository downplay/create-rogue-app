// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require('moo')
 
const assign = { match: /\$[a-zA-Z0-9]+=/, push:'nospace', value: x => x.slice(1, x.length - 1) }
const bassign = { match: /\$\([a-zA-Z0-9 ]+\)=/, push:'nospace', value: x => x.slice(2, x.length - 2) } 
const sub =  { match: /\$[a-zA-Z0-9]+/, value: x => x.slice(1) }
const bsub = { match: /\$\(/, push:'sublabel' }
const bsubend = { match: /\)/, pop:1 }
const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks:true }
const space = { match: /[ \t]+/, lineBreaks: false }
	  
const lexer = moo.states({
	line: {
		bang: /^!/,
		assign,
		bassign,
		sub,
		bsub,
		label: { match: /^[a-zA-Z0-9 ]+:\s*$/, value: x => x.slice(0, x.indexOf(":")), push: "labelparams" },
		labeleq: { match: /^[a-zA-Z0-9 ]+:=\s*$/, value: x => x.slice(0, x.indexOf(":")) },
		labeleqmerge: { match: /^[a-zA-Z0-9 ]+:=~\s*$/, value: x => x.slice(0, x.indexOf(":")) },
		labelplus: { match: /^[a-zA-Z0-9 ]+:\+\s*$/, value: x => x.slice(0, x.indexOf(":")), push: "labelparams" },
		labelplusmerge: { match: /^[a-zA-Z0-9 ]+:+~\+\s*$/, value: x => x.slice(0, x.indexOf(":")), push: "labelparams" },
		labelmerge: { match: /^[a-zA-Z0-9 ]+:~\s*$/, value: x => x.slice(0, x.indexOf(":")), push: "labelparams" },
		string: /(?:\$\$|\(\(|\)\)|\\[\\()\$\[]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|\[\]])+/,
		newline: { match: /(?:\r\n|\r|\n)/, lineBreaks:true },
		space,
		'[': { match: '[', push: 'precondition' },
		'$': '$',
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	},
	group: {
		string: { match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$|\[\]])+/, lineBreaks:true },
		assign,
		bassign,
		sub,
		bsub,
		'[': { match: '[', push: 'precondition' },
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	},
	nospace: {
		string: { match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\s|\[\]])+/, lineBreaks:true },
		assign,
		bassign,
		sub,
		bsub,
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
		space: { match: /(?=[ \t\r\n])/, lineBreaks: true, pop: 1 },
	},
	labelparams: {
		space,
		newline: { ...newline,  pop: 1 },
	},
	sublabel: {
		string: { match: /[a-zA-Z0-9 ]+/ },
		assign,
		bassign,
		sub,
		bsub,
		bsubend,
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	},
	precondition: {
		space,
		number: /-?[0-9]+(?:\.[0-9]+)?\%?/,
		compare: /(?:[<>=!]=?)/,
		sub,
		bsub,
		'(': { match: '(', push: 'group' },
		']': { match: ']', pop: 1 },
		',': ',',
		'%': '%',
		'|': '|',
	}
})

const empty = () => null

const textContent = (text) => ({type:"text", text})

const subContent = (label) => {
	// Simplifly if there is just a single text element anyway
	if (typeof label !== "string") {
		if (label.type === "text") {
			label = label.text;
		}
	}
	return {type:"substitution", label};
}

const assignContent = (variable, content) => {
	return ({type:"assignment", content:choices(content), variable})
}

const choices = (items) => {
	if (items.length === 1) {
		// TODO: Unless some precondition
		return items[0].content;
	}
	if (items.length === 0) {
		// TODO: Should never happen? Actually better to allow it though...
		return textContent("");
	}
	return {type: "choices", content: items}
}

const main = (content, labels) => ({type: "main", content: choices(content), labels})

const choice = (content, preconditions) => ()=>{
	const result = {type:"choice", content, weight: 10, preconditions: []}
	preconditions.forEach(cond => {
		if (cond.type === "number" || cond.type === "percent") {
			result.weight = cond.value;
		} else {
			result.preconditions.push(cond);
		}
	})
	return result;
}

const label = (name, items, mode, merge = false) => ({type: "label", name, content: choices(items), mode, merge})

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

const flatParts = (a) => a.length === 1 ? a[0] : a

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "content", "_"], "postprocess": d => main(d[1], [])},
    {"name": "main", "symbols": ["_", "content", "_", "labels", "_"], "postprocess": d => main(d[1], d[3])},
    {"name": "main", "symbols": ["_", "labels", "_"], "postprocess": d => main([], d[1])},
    {"name": "labels", "symbols": ["labelledContent"], "postprocess": d => [d[0]]},
    {"name": "labels", "symbols": ["labels", "labelledContent"], "postprocess": d => [...d[0], d[1]]},
    {"name": "labelledContent", "symbols": ["label", "_", "content", "_"], "postprocess": d => label(d[0][0], d[2], d[0][1], d[0][2])},
    {"name": "label", "symbols": [(lexer.has("label") ? {type: "label"} : label), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "label"]},
    {"name": "label", "symbols": [(lexer.has("labeleq") ? {type: "labeleq"} : labeleq), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "set"]},
    {"name": "label", "symbols": [(lexer.has("labelplus") ? {type: "labelplus"} : labelplus), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "all"]},
    {"name": "label", "symbols": [(lexer.has("labelmerge") ? {type: "labelmerge"} : labelmerge), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "label", true]},
    {"name": "label", "symbols": [(lexer.has("labeleqmerge") ? {type: "labeleqmerge"} : labeleqmerge), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "set", true]},
    {"name": "label", "symbols": [(lexer.has("labelplusmerge") ? {type: "labelplusmerge"} : labelplusmerge), (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => [d[0].value, "all", true]},
    {"name": "content", "symbols": ["line"], "postprocess": d => [d[0]]},
    {"name": "content", "symbols": ["content", "line"], "postprocess": d => [...d[0], d[1]]},
    {"name": "line", "symbols": ["choices", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => choice(choices(d[0]))},
    {"name": "group", "symbols": [{"literal":"("}, "choices", {"literal":")"}], "postprocess": d => choices(d[1])},
    {"name": "choices", "symbols": ["choice"], "postprocess": d => [d[0]]},
    {"name": "choices", "symbols": ["choices", {"literal":"|"}, "choice"], "postprocess": d => [...d[0], d[2]]},
    {"name": "choice", "symbols": ["preconditions", "flatParts"], "postprocess": d => choice(d[1], d[0])},
    {"name": "choice", "symbols": ["flatParts"], "postprocess": d => choice(d[0])},
    {"name": "preconditions", "symbols": [{"literal":"["}, "conditions", {"literal":"]"}]},
    {"name": "conditions", "symbols": ["condition"]},
    {"name": "conditions", "symbols": ["conditions", {"literal":","}, "condition"]},
    {"name": "condition", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "condition", "symbols": [(lexer.has("number") ? {type: "number"} : number), {"literal":"%"}]},
    {"name": "condition", "symbols": [(lexer.has("compare") ? {type: "compare"} : compare), (lexer.has("number") ? {type: "number"} : number)]},
    {"name": "condition", "symbols": ["conditionValue"]},
    {"name": "condition", "symbols": ["conditionValue", (lexer.has("compare") ? {type: "compare"} : compare), "conditionValue"]},
    {"name": "conditionValue", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "conditionValue", "symbols": ["parts"]},
    {"name": "flatParts", "symbols": ["parts"], "postprocess": d => flatParts(d[0])},
    {"name": "parts", "symbols": ["part"], "postprocess": d => [d[0]]},
    {"name": "parts", "symbols": ["parts", "part"], "postprocess": d => [...d[0], d[1]]},
    {"name": "part", "symbols": ["string"], "postprocess": d => textContent(d[0])},
    {"name": "part", "symbols": ["group"], "postprocess": id},
    {"name": "part", "symbols": ["assignment"], "postprocess": id},
    {"name": "part", "symbols": ["substitution"], "postprocess": id},
    {"name": "substitution", "symbols": [(lexer.has("sub") ? {type: "sub"} : sub)], "postprocess": d => subContent(d[0].value)},
    {"name": "substitution", "symbols": [(lexer.has("bsub") ? {type: "bsub"} : bsub), "choices", (lexer.has("bsubend") ? {type: "bsubend"} : bsubend)], "postprocess": d => subContent(choices(d[1]))},
    {"name": "assignment", "symbols": [(lexer.has("assign") ? {type: "assign"} : assign), "choices", (lexer.has("space") ? {type: "space"} : space)], "postprocess": d => assignContent(d[0].value, d[1])},
    {"name": "assignment", "symbols": [(lexer.has("bassign") ? {type: "bassign"} : bassign), "choices", (lexer.has("space") ? {type: "space"} : space)], "postprocess": d => assignContent(d[0].value, d[1])},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": d => d[0].value},
    {"name": "_", "symbols": ["whitespace"], "postprocess": empty},
    {"name": "whitespace", "symbols": ["whitespace", (lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "whitespace", "symbols": ["whitespace", (lexer.has("space") ? {type: "space"} : space)]},
    {"name": "whitespace", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "whitespace", "symbols": [(lexer.has("space") ? {type: "space"} : space)]},
    {"name": "whitespace", "symbols": []}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

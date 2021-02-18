@{%

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

%}

@lexer lexer

main              -> _ content _                    {% d => main(d[1], []) %}
                  | _ content _ labels _           {% d => main(d[1], d[3]) %}
                  | _ labels _                     {% d => main([], d[1]) %}

labels           -> labelledContent                {% d => [d[0]] %}	
                  | labels labelledContent         {% d => [...d[0], d[1]] %}

labelledContent  -> label _ content _          {% d => label(d[0][0], d[2], d[0][1], d[0][2]) %}

label             -> %label %newline                {% d => [d[0].value, "label"] %}
				   | %labeleq %newline              {% d => [d[0].value, "set"] %}
				   | %labelplus %newline            {% d => [d[0].value, "all"] %}
				   | %labelmerge %newline           {% d => [d[0].value, "label", true] %}
				   | %labeleqmerge %newline           {% d => [d[0].value, "set", true] %}
				   | %labelplusmerge %newline           {% d => [d[0].value, "all", true] %}

content           -> line                           {% d => [d[0]] %}
                   | content line                   {% d => [...d[0], d[1]] %}

line              -> choices %newline                 {% d => choice(choices(d[0])) %}

group             -> "(" choices ")"                  {% d => choices(d[1]) %}

choices           -> choice                         {% d => [d[0]] %}                         
                    | choices "|" choice            {% d => [...d[0], d[2]] %}

choice            -> preconditions flatParts           {% d => choice(d[1], d[0]) %}
                   | flatParts                         {% d => choice(d[0]) %}

preconditions     -> "[" conditions "]"

conditions        -> condition
                   | conditions "," condition

condition         -> %number
                   | %number "%"
                   | %compare %number
				   | conditionValue
				   | conditionValue %compare conditionValue

conditionValue    -> %number
                   | parts

flatParts         -> parts                          {% d => flatParts(d[0]) %}

parts             -> part                          {% d => [d[0]] %}
                   | parts part                    {% d => [...d[0], d[1]] %}

part              -> string                        {% d => textContent(d[0]) %}
                   | group                        {% id %}
                   | assignment                   {% id %}
                   | substitution                 {% id %}

substitution      -> %sub                          {% d => subContent(d[0].value) %}
                   | %bsub choices %bsubend          {% d => subContent(choices(d[1])) %}

assignment        -> %assign choices %space         {% d => assignContent(d[0].value, d[1]) %}
                   | %bassign choices %space         {% d => assignContent(d[0].value, d[1]) %}
				   
string            -> %string                       {% d => d[0].value %}

_                 -> whitespace                         {% empty %} 

whitespace        -> whitespace %newline
                   | whitespace %space
				   | %newline
				   | %space
				   | null
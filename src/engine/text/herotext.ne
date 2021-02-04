@{%

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

const flatParts = (a) => a.length === 1 ? a[0] : a

const bracketSlice = value => value.slice(2, value.length - 1)


%}

@lexer lexer

main              -> _ content _                    {% d => main(d[1], []) %}
                  | _ content _ labels _           {% d => main(d[1], d[3]) %}
                  | _ labels _                     {% d => main(null, d[1]) %}

labels           -> labelledContent                {% d => [d[0]] %}	
                  | labels labelledContent         {% d => [...d[0], d[1]] %}

labelledContent  -> label _ content _          {% d => label(d[0], d[2]) %}

label            -> %label %newline         {% d => d[0].value.slice(0, d[0].value.length - 1) %}

content           -> line                           {% d => [d[0]] %}
                   | content line                   {% d => [...d[0], d[1]] %}

line              -> choices %newline                 {% d => choice(choices(d[0])) %}

group             -> "(" choices ")"                  {% d => choices(d[1]) %}

choices           -> choice                         {% d => [d[0]] %}                         
                    | choices "|" choice            {% d => [...d[0], d[2]] %}

# Need to add preconditions etc
choice            -> flatParts                         {% d => choice(d[0]) %}

flatParts         -> parts                          {% d => flatParts(d[0]) %}

parts             -> part                          {% d => [d[0]] %}
                   | parts part                    {% d => [...d[0], d[1]] %}

part              -> string                        {% d => textContent(d[0]) %}
                    | group                        {% id %}
                   | substitution                   {% id %}

substitution      -> %sub                          {% d => subContent(d[0].value.slice(1)) %}
                   | %bsub                         {% d => subContent(bracketSlice(d[0].value)) %}

string            -> %string                       {% d => d[0].value %}

_                 -> %space                         {% empty %} 
                   | %newline                       {% empty %}
                   | null                           {% empty %}


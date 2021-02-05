@{%

 const moo = require('moo')
 
		const assign = { match: /\$[a-zA-Z0-9]+=/, push:'nospace', value: x => x.slice(1, x.length - 1) }
		const bassign = { match: /\$\([a-zA-Z0-9 ]+\)=/, push:'nospace', value: x => x.slice(2, x.length - 2) } 
		const sub =  /\$[a-zA-Z0-9]+/
		const bsub = /\$\([a-zA-Z0-9 ]+\)/
		const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks:true }
	  
const lexer = moo.states({
	line: {
		bang: /^!/,
		assign,
		bassign,
		sub,
		bsub,
		label: { match: /^[a-zA-Z0-9 ]+:\s*$/, value: x => x.slice(0, x.indexOf(":")), push: "labelparams" },
		string: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|])+/,
		newline: { match: /(?:\r\n|\r|\n)/, lineBreaks:true },
		space: { match: /[ \t]+/, lineBreaks: false },
		'$': '$',
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	},
	group: {
		string: { match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$|])+/, lineBreaks:true },
		assign,
		bassign,
		sub,
		bsub,
		'(': { match: '(', push: 'group' },
		')': { match: ')', pop: 1 },
		'|': '|',
	},
	nospace: {
		string: { match: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\s|])+/, lineBreaks:true },
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
		newline: { ...newline,  pop: 1 },
	}
})

const empty = () => null

const textContent = (text) => ({type:"text", text})

const subContent = (label) => ({type:"substitution", label})

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
                  | _ labels _                     {% d => main([], d[1]) %}

labels           -> labelledContent                {% d => [d[0]] %}	
                  | labels labelledContent         {% d => [...d[0], d[1]] %}

labelledContent  -> label _ content _          {% d => label(d[0], d[2]) %}

label            -> %label %newline         {% d => d[0].value %}

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
                   | assignment                   {% id %}
                   | substitution                 {% id %}

substitution      -> %sub                          {% d => subContent(d[0].value.slice(1)) %}
                   | %bsub                         {% d => subContent(bracketSlice(d[0].value)) %}

assignment        -> %assign choices %space         {% d => assignContent(d[0].value, d[1]) %}
                   | %bassign choices %space         {% d => assignContent(d[0].value, d[1]) %}
				   
string            -> %string                       {% d => d[0].value %}

_                 -> %space                         {% empty %} 
                   | %newline                       {% empty %}
                   | null                           {% empty %}
